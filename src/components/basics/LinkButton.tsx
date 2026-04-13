import styled from "styled-components";
import { COLORS } from "../../constants/colors";

type Props = {
    title: React.ReactNode;
    size?: string;
    onClick?: () => void;
    marginBottom?: string;
    align?: "left" | "center" | "right" | "justify";
};

export default function LinkButton({ title, size, align, marginBottom, onClick }: Props) {
    return (
        <ButtonText
            $size={size}
            $align={align}
            $marginBottom={marginBottom}
            onClick={onClick}
        >
            {title}
        </ButtonText>
    );
}

const ButtonText = styled.span<{ $size?: string; $align?: string; $marginBottom?: string }>`
  font-size: ${({ $size }) => $size || "0.95rem"};
  font-weight: 600;
  color: ${COLORS.primary};
  text-align: ${({ $align }) => $align || "left"};
  
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    opacity: 0.7;
    text-decoration: underline;
  }
`;
