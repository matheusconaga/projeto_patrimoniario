import styled from "styled-components";
import Container from "../../components/layout/Container";
import logo from "../../assets/logo.png";
import TextInput from "../../components/basics/TextInput";
import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import AppButton from "../../components/basics/AppButton";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { FirebaseError } from "firebase/app";
import { COLORS } from "../../constants/colors";
import { toast } from "react-toastify";
import Titulo from "../../components/layout/Titulo";
import LinkButton from "../../components/basics/LinkButton";

type LocationState = {
  from?: string;
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;
  const stateRedirect = state?.from;

  const queryRedirect = new URLSearchParams(location.search).get("redirect");

  const redirect = stateRedirect || queryRedirect || "/";

  const [email, setEmail] = useState("visit@gmail.com");
  const [senha, setSenha] = useState("visit123");
  const [loading, setLoading] = useState(false);

  function traduzErroLogin(error: FirebaseError | Error): string {
    if (error.message.includes("não foi aprovada")) {
      return "Sua conta ainda não foi aprovada pelo administrador.";
    }

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          return "Email ou senha incorretos.";

        case "auth/invalid-email":
          return "Email inválido.";

        case "auth/too-many-requests":
          return "Muitas tentativas. Tente novamente mais tarde.";

        default:
          return "Erro ao fazer login. Tente novamente.";
      }
    }

    return "Erro inesperado!";
  }

  const login = async () => {
    if (!email || !senha) {
      toast.warning("Preencha todos os campos!");
      return;
    }

    setLoading(true);

    try {
      await loginUser(email, senha);
      toast.success("Login realizado com sucesso!");
      setTimeout(() => {
        navigate(redirect);
      }, 1000);

    } catch (error) {
      const msg = traduzErroLogin(error as FirebaseError | Error);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <LoadingOverlay>
          <Spinner />
          <p>Entrando...</p>
        </LoadingOverlay>
      )}

      <Wrapper>
        <InfoText>
          <Titulo title="Essa é uma versão de demonstração." size="14px" />
        </InfoText>
        <Container>
          <Column>
            <Logo src={logo} alt="Logo" />

            <TextInput
              title="Email"
              placeholder="Insira seu email"
              icon={<Mail size={20} />}
              value={email}
              onChange={setEmail}
              width="100%"
            />

            <TextInput
              title="Senha"
              placeholder="Insira sua senha"
              icon={<Lock size={20} />}
              value={senha}
              onChange={setSenha}
              type="password"
              width="100%"
            />

            <AppButton
              func={login}
              text={loading ? "Carregando..." : "Entrar"}
              disabled={loading}
            />

            <Titulo title="Ainda não possui conta?" marginBottom="0" align="center" />

            <LinkButton
              title="Criar conta"
              align="center"
              onClick={() => navigate("/register")}
            />

          </Column>
        </Container>
      </Wrapper>
    </>
  );
}

const InfoText = styled.div`

  text-align: left;


`

const Wrapper = styled.div`
  width: 100%;
  max-width: 28em;
  min-height: 100vh;
  flex-direction: column;

  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 16px;

  @media (max-width: 480px) {
    padding: 8px;
  }
`;

const Logo = styled.img`
  width: 180px;
  height: auto;
  align-self: center;
  transition: width 0.3s ease;

  @media (max-width: 768px) {
    width: 140px;
  }

  @media (max-width: 480px) {
    width: 110px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 100%;
  max-width: 400px;

  @media (max-width: 480px) {
    max-width: 100%;
    gap: 0.8em;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgb(0 0 0 / 40%);
  backdrop-filter: blur(2px);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 16px;
  z-index: 9999;

  color: white;
  font-size: 1.2rem;
  font-weight: 700;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid ${COLORS.primary};
  border-top: 5px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
