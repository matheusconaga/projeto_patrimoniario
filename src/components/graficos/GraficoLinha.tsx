import { useMemo, useState } from "react";
import styled from "styled-components";
import Container from "../layout/Container";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { COLORS } from "../../constants/colors";
import AppButton from "../basics/AppButton";
import Titulo from "../layout/Titulo";
import { getMovimentacaoMensal, type MovimentacaoMes } from "../../services/modelosService";
import type { PatrimonioIndividual } from "../../types/patrimonioTypes";

interface Props {
    patrimonios: PatrimonioIndividual[];
}

export default function GraficoLinha({ patrimonios }: Props) {
    const [isSaldo, setIsSaldo] = useState(true);
    const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());


    const anosDisponiveis = useMemo(() => {
        const anosSet = new Set<number>();
        patrimonios.forEach(p => {
            const ano = new Date(p.dataAquisicao).getFullYear();
            anosSet.add(ano);
        });
        return Array.from(anosSet).sort((a, b) => a - b);
    }, [patrimonios]);


    const data: MovimentacaoMes[] = useMemo(() => {
        return getMovimentacaoMensal(patrimonios, anoSelecionado);
    }, [patrimonios, anoSelecionado]);

    const titulo = isSaldo
        ? `Movimentação de patrimônio (${anoSelecionado})`
        : `Movimentação de saldo (${anoSelecionado})`;


    return (
        <Wrapper>
            <Container>
                <Titulo title={titulo} marginBottom="2em"/>
                <ChartWrapper>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis dataKey="name" />
                            <YAxis width={25} />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey={isSaldo ? "patrimonio" : "saldo"}
                                stroke={COLORS.primary}
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartWrapper>

                <ButtonContainer>
                    <AppButton
                        text="Movimentação de Patrimônio"
                        func={() => setIsSaldo(true)}
                        color={isSaldo ? COLORS.light : COLORS.primary}
                        disabled={isSaldo}
                    />
                    <AppButton
                        text="Movimentação de saldo "
                        func={() => setIsSaldo(false)}
                        color={!isSaldo ? COLORS.light : COLORS.primary}
                        disabled={!isSaldo}
                    />
                </ButtonContainer>

                <AnoButtonContainer>
                    {anosDisponiveis.map(a => (
                        <AppButton
                            key={a}
                            text={a.toString()}
                            func={() => setAnoSelecionado(a)}
                            disabled={anoSelecionado === a}
                        />
                    ))}
                </AnoButtonContainer>
            </Container>
        </Wrapper>
    );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  width: 100%;
`;

const ChartWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  height: 300px;

  @media (max-width: 600px) {
    height: 220px;
  }

  @media (max-width: 420px) {
    height: 180px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 1em;
`;

const AnoButtonContainer = styled.div`display: flex; justify-content: center; gap: 6px; flex-wrap: wrap; margin-top: 1em;`;
