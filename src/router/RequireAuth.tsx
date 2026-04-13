import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import type { ReactNode } from "react";
import { COLORS } from "../constants/colors";
import styled from "styled-components";

type RequireAuthProps = {
    children: ReactNode;
};

export default function RequireAuth({ children }: RequireAuthProps) {
    const { user, loading } = useAuthStore();
    const location = useLocation();

    if (loading)
        return (
            <LoadingOverlay>
                <Spinner />
                <p>Carregando Informações...</p>
            </LoadingOverlay>
        );

    if (!user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    return <>{children}</>;
}

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
