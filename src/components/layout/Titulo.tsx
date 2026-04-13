import styled from "styled-components";
import { COLORS } from "../../constants/colors";

type Props = {
  title: React.ReactNode;
  size?: string;
  marginBottom?: string;
  align?: "left" | "center" | "right" | "justify";
};

export default function Titulo({ title, size, align, marginBottom }: Props) {
  return <Title $size={size} $align={align} $marginBottom={marginBottom}>{title}</Title>;
}

const Title = styled.h3<{ $size?: string; $align?: string; $marginBottom?: string }>`
  font-size: ${({ $size }) => $size || "1rem"};
  font-weight: 600;
  color: ${COLORS.dark};
  margin-bottom: ${({ $marginBottom }) => $marginBottom || "1em"};
  text-align: ${({ $align }) => $align || "left"};
`;
