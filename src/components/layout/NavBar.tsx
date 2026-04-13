import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import logo from "../../assets/logo.png";
import AppButton from "../basics/AppButton";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import Titulo from "./Titulo";
import { useState } from "react";
import type { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";

export default function NavBar() {

  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);


  const handleLogout = async () => {
    toast.info(
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
        <Titulo title="Tem certeza que deseja sair?" marginBottom="0" />

        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>

          <AppButton text="Sair" color={COLORS.danger_card} icon={<LogOut size={20} />} func={async () => {
            toast.dismiss();

            setLoading(true);
            try {
              await logout();
            } catch (error) {
              const err = error as FirebaseError;
              toast.error("Erro ao sair: " + (err.message ?? "Erro desconhecido"));
            } finally {
              setLoading(false);
            }
          }} />

          <AppButton text="Cancelar" color={COLORS.seccundary} func={() => toast.dismiss()} />
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
      }
    );
  };


  return (

    <>
      {loading && (
        <LoadingOverlay>
          <Spinner />
          <p>Entrando...</p>
        </LoadingOverlay>
      )}
      <Background>
        <Itens>
          <Logo src={logo} alt="Logo" />
          <RightItens>
            <MobileTitleWrapper>
              <Titulo title={`Bem-vindo(a)! ${user?.displayName}`} marginBottom="0" />
            </MobileTitleWrapper>

            <AppButton
              text={loading ? "Saindo..." : "Sair"}
              func={handleLogout}
              disabled={loading}
              icon={<LogOut size={20} />}
            />
          </RightItens>
        </Itens>
      </Background>
    </>
  );
}

const Background = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: ${COLORS.light};
  color: black;
  padding: 0.4em 0;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.1);

   @media (max-width: 480px) {
  padding: 0.8em 0;

   @media (max-width: 380px) {
  padding: 0.8em 0;
}

    
  }

`;

const MobileTitleWrapper = styled.div`
  @media (max-width: 480px) {
    font-size: 0.85rem;    
    font-weight: 600;      
    display: flex;
    align-items: center;
  }

  @media (max-width: 480px) {
    * {
      font-size: 0.85rem !important;
    }
  }
`;


const RightItens = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5em;

  @media (max-width: 480px) {
    flex-direction: row;
    justify-content: end;
    gap: 0.6em;
    width: 100%;
  }
`;

const Itens = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  width: 80%;
  max-width: 1200px;

  @media (max-width: 768px) {
    width: 90%;
  }

  @media (max-width: 480px) {
    flex-direction: row;
    align-items: center;
    gap: 0.6em;
    text-align: center;
  }
`;

const Logo = styled.img`
  width: 200px;
  height: auto;
  transition: width 0.3s ease;

  @media (max-width: 768px) {
    width: 120px;
  }

  @media (max-width: 480px) {
    width: 95px;
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