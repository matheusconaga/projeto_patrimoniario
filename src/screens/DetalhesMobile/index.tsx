import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../api/firebase/firebase";

import DetalhesPatrimonio from "../Detalhes";
import type { PatrimonioIndividual, ModeloPatrimonial } from "../../types/patrimonioTypes";
import ActionButton from "../../components/basics/ActionButton";

export default function DetalhesMobile() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [patrimonio, setPatrimonio] = useState<PatrimonioIndividual | null>(null);
    const [modelo, setModelo] = useState<ModeloPatrimonial | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregar() {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                const patrimonioRef = doc(db, "patrimonioIndividual", id);
                const snap = await getDoc(patrimonioRef);

                if (snap.exists()) {
                    const data = { id, ...snap.data() } as PatrimonioIndividual;
                    setPatrimonio(data);

                    if (data.modeloId) {
                        const modeloRef = doc(db, "modelos", data.modeloId);
                        const modeloSnap = await getDoc(modeloRef);
                        if (modeloSnap.exists()) {
                            setModelo({ id: data.modeloId, ...modeloSnap.data() } as ModeloPatrimonial);
                        }
                    }
                }
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, [id]);

    if (loading) return <p>Carregando...</p>;
    if (!patrimonio) return <p>Patrimônio não encontrado</p>;

    console.log("Modelo carregado:", modelo);


    return (
        <Wrapper>
            <CloseButton>
                <ActionButton type="fechar" func={() => navigate("/")}/>
            </CloseButton>

            <Content>
                <DetalhesPatrimonio patrimonio={patrimonio} modelo={modelo ?? undefined} />

            </Content>
        </Wrapper>
    );
}


const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  padding-top: 5em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  border: none;
  cursor: pointer;
  background-color: transparent;
  transition: 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const Content = styled.div`
  width: 100%;
  padding: 0 10px;
  display: flex;
  justify-content: center;
`;
