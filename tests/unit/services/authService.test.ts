import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';

import {
  isValidEmail,
  normalizeName,
  normalizeEmail,
  registerUser,
  loginUser,
  getLoggedUserName,
} from '../../../src/services/authService';

import * as mockFirebase from '../../../tests/mocks/firebase';

const mockAuth = mockFirebase.auth as {
  currentUser: { uid: string } | null;
};

const mockData = mockFirebase.db._data as Record<string, any>;

describe('authService utilities', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });

    it('should handle whitespace', () => {
      expect(isValidEmail('  test@example.com  ')).toBe(true);
      expect(isValidEmail('test@example.com ')).toBe(true);
    });
  });

  describe('normalizeName', () => {
    it('should capitalize first letter of each word', () => {
      expect(normalizeName('john doe')).toBe('John Doe');
      expect(normalizeName('JOHN DOE')).toBe('John Doe');
      expect(normalizeName('jOhN dOe')).toBe('John Doe');
    });

    it('should handle multiple spaces', () => {
      expect(normalizeName('john  doe')).toBe('John Doe');
      expect(normalizeName('  john   doe  ')).toBe('John Doe');
    });

    it('should handle single word names', () => {
      expect(normalizeName('john')).toBe('John');
      expect(normalizeName('JOHN')).toBe('John');
    });

    it('should trim whitespace', () => {
      expect(normalizeName(' john doe ')).toBe('John Doe');
    });
  });

  describe('normalizeEmail', () => {
    it('should convert to lowercase', () => {
      expect(normalizeEmail('TEST@EXAMPLE.COM')).toBe(
        'test@example.com'
      );

      expect(normalizeEmail('Test@Example.Com')).toBe(
        'test@example.com'
      );
    });

    it('should trim whitespace', () => {
      expect(normalizeEmail('  test@example.com  ')).toBe(
        'test@example.com'
      );
    });

    it('should handle already normalized emails', () => {
      expect(normalizeEmail('test@example.com')).toBe(
        'test@example.com'
      );
    });
  });
});

describe('authService async functions', () => {
  beforeEach(() => {
    mockFirebase.db._resetData();
    mockAuth.currentUser = null;
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockFirebase.db._resetData();
    mockAuth.currentUser = null;
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should throw error for invalid email', async () => {
      await expect(
        registerUser('John Doe', 'invalid', 'password123')
      ).rejects.toThrow('Email inválido.');
    });

    it('should register user successfully', async () => {
      const mockUser = {
        uid: 'user123',
        email: 'test@example.com',
      };

      mockFirebase.createUserWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      });

      const result = await registerUser(
        'John Doe',
        'test@example.com',
        'password123'
      );

      expect(result).toEqual(mockUser);

      expect(
        mockFirebase.createUserWithEmailAndPassword
      ).toHaveBeenCalledWith(
        mockFirebase.auth,
        'test@example.com',
        'password123'
      );

      expect(mockFirebase.setDoc).toHaveBeenCalled();
    });

    it('should throw Firebase error on registration failure', async () => {
      const firebaseError = new Error(
        'auth/email-already-in-use'
      );

      (firebaseError as any).code =
        'auth/email-already-in-use';

      mockFirebase.createUserWithEmailAndPassword.mockRejectedValue(
        firebaseError
      );

      await expect(
        registerUser(
          'John Doe',
          'test@example.com',
          'password123'
        )
      ).rejects.toThrow(firebaseError);
    });

    it('should throw generic error on unknown error', async () => {
      const firebaseError = new Error('Unknown error');

      mockFirebase.createUserWithEmailAndPassword.mockRejectedValue(
        firebaseError
      );

      await expect(
        registerUser(
          'John Doe',
          'test@example.com',
          'password123'
        )
      ).rejects.toThrow('Unknown error');
    });
  });

  describe('loginUser', () => {
    it('should throw error for invalid email', async () => {
      await expect(
        loginUser('invalid', 'password123')
      ).rejects.toThrow('Email inválido.');
    });

    it('should login user successfully when approved', async () => {
      const mockUser = {
        uid: 'user123',
        email: 'test@example.com',
      };

      mockFirebase.signInWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      });

      mockData.users = {
        user123: {
          name: 'John Doe',
          email: 'test@example.com',
          approved: true,
        },
      };

      const result = await loginUser(
        'test@example.com',
        'password123'
      );

      expect(result).toEqual(mockUser);

      expect(
        mockFirebase.signInWithEmailAndPassword
      ).toHaveBeenCalledWith(
        mockFirebase.auth,
        'test@example.com',
        'password123'
      );
    });

    it('should throw error when user not found in database', async () => {
      const mockUser = {
        uid: 'user123',
        email: 'test@example.com',
      };

      mockFirebase.signInWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      });

      mockData.users = {};

      await expect(
        loginUser(
          'test@example.com',
          'password123'
        )
      ).rejects.toThrow(
        'Conta não encontrada no banco.'
      );
    });

    it('should throw error when user is not approved', async () => {
      const mockUser = {
        uid: 'user123',
        email: 'test@example.com',
      };

      mockFirebase.signInWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      });

      mockData.users = {
        user123: {
          name: 'John Doe',
          email: 'test@example.com',
          approved: false,
        },
      };

      await expect(
        loginUser(
          'test@example.com',
          'password123'
        )
      ).rejects.toThrow(
        'Sua conta ainda não foi aprovada pelo administrador.'
      );

      expect(mockFirebase.signOut).toHaveBeenCalledWith(
        mockFirebase.auth
      );
    });
  });

  describe('getLoggedUserName', () => {
    it('should return "Usuário" when no current user', async () => {
      mockAuth.currentUser = null;

      const result = await getLoggedUserName();

      expect(result).toBe('Usuário');
    });

    it('should return user name when user is logged in', async () => {
      mockAuth.currentUser = {
        uid: 'user123',
      };

      mockData.users = {
        user123: {
          name: 'John Doe',
          email: 'test@example.com',
        },
      };

      const result = await getLoggedUserName();

      expect(result).toBe('John Doe');
    });

    it('should return "Usuário" when user document not found', async () => {
      mockAuth.currentUser = {
        uid: 'user123',
      };

      mockData.users = {};

      const result = await getLoggedUserName();

      expect(result).toBe('Usuário');
    });

    it('should return "Usuário" when user has no name', async () => {
      mockAuth.currentUser = {
        uid: 'user123',
      };

      mockData.users = {
        user123: {
          email: 'test@example.com',
        },
      };

      const result = await getLoggedUserName();

      expect(result).toBe('Usuário');
    });
  });
});

