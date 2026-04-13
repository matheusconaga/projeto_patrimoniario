import styled from "styled-components";
import Container from "../../components/layout/Container";
import logo from "../../assets/logo.png";
import TextInput from "../../components/basics/TextInput";
import { Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import AppButton from "../../components/basics/AppButton";
import LinkButton from "../../components/basics/LinkButton";
import Titulo from "../../components/layout/Titulo";
import { useNavigate } from "react-router-dom";
// import { registerUser } from "../../services/authService";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";
import { COLORS } from "../../constants/colors";


export default function Register() {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [loading, setLoading] = useState(false);


    const handleRegister = async () => {

        if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
            toast.warning("Preencha todos os campos!");
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            toast.error("Digite um email válido!");
            return;
        }

        if (senha.length < 6) {
            toast.warning("A senha deve ter no mínimo 6 caracteres!");
            return;
        }

        if (senha !== confirmarSenha) {
            toast.warning("As senhas não coincidem!");
            return;
        }

        setLoading(true);
        try {
            // await registerUser(nome, email, senha);

            // toast.success("Conta criada com sucesso! Aguarde aprovação do administrador.")
            toast.success("A funcionalidade de registro foi desativada temporariamente.");
            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            const err = error as FirebaseError;
            toast.error("Erro ao criar conta: " + (err.message ?? "Erro desconhecido"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            {loading && (
                <LoadingOverlay>
                    <Spinner />
                    <p>Registrando...</p>
                </LoadingOverlay>
            )}
            <Wrapper>
                <Container>
                    <Column>
                        <Logo src={logo} alt="Logo" />

                        <TextInput
                            title="Nome do Inventariante"
                            required
                            placeholder="Digite seu nome"
                            icon={<User size={20} />}
                            value={nome}
                            onChange={setNome}
                            width="100%"
                        />

                        <TextInput
                            title="Email"
                            required
                            icon={<Mail size={20} />}
                            value={email}
                            onChange={setEmail}
                            externalError={
                                email && email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                                    ? "Email inválido"
                                    : undefined
                            }

                            width="100%"
                        />

                        <TextInput
                            title="Senha"
                            placeholder="Crie uma senha"
                            required
                            icon={<Lock size={20} />}
                            value={senha}
                            onChange={setSenha}
                            type="password"
                            width="100%"
                            externalError={
                                senha && senha.length < 6
                                    ? "A senha deve ter no mínimo 6 caracteres"
                                    : undefined
                            }

                        />


                        <TextInput
                            title="Confirmar senha"
                            required
                            type="password"
                            icon={<Lock size={20} />}
                            value={confirmarSenha}
                            onChange={setConfirmarSenha}
                            externalError={
                                confirmarSenha && senha !== confirmarSenha
                                    ? "As senhas não coincidem"
                                    : undefined
                            }

                            width="100%"
                        />


                        <AppButton func={handleRegister} text="Criar conta" />

                        <Titulo title="Já possui uma conta?" marginBottom="0" align="center" />

                        <LinkButton
                            title="Fazer login"
                            align="center"
                            onClick={() => navigate("/login")}
                        />
                    </Column>
                </Container>
            </Wrapper>
        </>
    );
}



const Wrapper = styled.div`
  width: 100%;
  max-width: 28em;
  min-height: 100vh;

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
