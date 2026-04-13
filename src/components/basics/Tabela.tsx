import styled from "styled-components";
import { COLORS } from "../../constants/colors";
import type { ReactNode } from "react";
import { useState, useMemo, useEffect } from "react";

type Column = {
  title: string;
};

type Row = {
  id?: string;
  cells: ReactNode[];
};

type Props = {
  columns: Column[];
  rows: Row[];
  itemsPerPage?: number;
  showCheckboxes?: boolean;
  selecionados?: string[];
  onSelecionar?: (ids: string[]) => void;
};

export default function Tabela({
  columns,
  rows,
  itemsPerPage = 10,
  showCheckboxes = false,
  selecionados = [],
  onSelecionar,
}: Props) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const totalPaginas = Math.max(1, Math.ceil(rows.length / itemsPerPage));

  useEffect(() => {
    if (paginaAtual > totalPaginas) {
      setPaginaAtual(1);
    }
  }, [paginaAtual, rows.length, totalPaginas]);


  const rowsPaginadas = useMemo(() => {
    const inicio = (paginaAtual - 1) * itemsPerPage;
    const fim = inicio + itemsPerPage;
    return rows.slice(inicio, fim);
  }, [paginaAtual, rows, itemsPerPage]);

  const handleSelecionar = (id: string) => {
    if (!onSelecionar) return;
    if (selecionados.includes(id)) {
      onSelecionar(selecionados.filter((s) => s !== id));
    } else {
      onSelecionar([...selecionados, id]);
    }
  };

  const handleTrocarPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaAtual(pagina);
    }
  };

  const inicioItem = (paginaAtual - 1) * itemsPerPage + 1;
  const fimItem = Math.min(paginaAtual * itemsPerPage, rows.length);

  return (
    <div>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              {showCheckboxes && <Th style={{ width: 40 }}></Th>}
              {columns.map((col, index) => (
                <Th key={index}>{col.title}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowsPaginadas.map((row, i) => (
              <Tr key={row.id ?? i} $even={i % 2 === 0}>
                {showCheckboxes && (
                  <Td>
                    {row.id && (
                      <Checkbox
                        checked={selecionados.includes(row.id)}
                        onChange={() => handleSelecionar(row.id!)}
                      />
                    )}
                  </Td>
                )}
                {row.cells.map((cell, j) => (
                  <Td key={j}>{cell}</Td>
                ))}
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      <PaginationContainer>
        <PageButton
          onClick={() => handleTrocarPagina(paginaAtual - 1)}
          disabled={paginaAtual === 1}
        >
          {"<"}
        </PageButton>

        {Array.from({ length: totalPaginas }, (_, i) => i + 1)
          .slice(Math.max(0, paginaAtual - 3), Math.min(totalPaginas, paginaAtual + 2))
          .map((num) => (
            <PageButton
              key={num}
              onClick={() => handleTrocarPagina(num)}
              $active={num === paginaAtual}
            >
              {num}
            </PageButton>
          ))}

        {paginaAtual < totalPaginas - 2 && totalPaginas > 5 && <span>...</span>}

        <PageButton
          onClick={() => handleTrocarPagina(paginaAtual + 1)}
          disabled={paginaAtual === totalPaginas}
        >
          {">"}
        </PageButton>

        <Info>
          Mostrando {inicioItem}–{fimItem} de {rows.length} itens
        </Info>
      </PaginationContainer>
    </div>
  );
}

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 18px;
  height: 18px;
  accent-color: ${COLORS.primary};
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    filter: brightness(1.1);
  }
`;


const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: ${COLORS.dark} #f1f1f1;
  padding: 6px;
`;

const Table = styled.table`
  margin: 0 auto ;
  width: 100%;
  max-width: 1200px;
  border-collapse: collapse;
  text-align: center;
`;

const Th = styled.th`
  background-color: ${COLORS.dark};
  color: white;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;

  &:first-child {
    border-top-left-radius: 12px;
  }
  &:last-child {
    border-top-right-radius: 12px;
  }
`;


const Tr = styled.tr<{ $even: boolean }>`
  background-color: ${({ $even }) => ($even ? COLORS.light : COLORS.white)};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
  vertical-align: middle;
  text-align: center;

  & > * {
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  &:first-child:last-of-type,
  tr:last-child &:first-child {
    border-bottom-left-radius: 12px;
  }

  tr:last-child &:last-child {
    border-bottom-right-radius: 12px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6em;
  margin-top: 1em;
  flex-wrap: wrap;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  background-color: ${({ $active }) => ($active ? COLORS.primary : "transparent")};
  color: ${({ $active }) => ($active ? "white" : COLORS.dark)};
  border: 1px solid ${COLORS.gray};
  border-radius: 6px;
  padding: 0.4em 0.8em;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: ${COLORS.primary};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: auto;
  }
`;

const Info = styled.span`
  margin-left: 1em;
  color: ${COLORS.gray};
  font-size: 0.9em;
`;
