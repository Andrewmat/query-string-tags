import styled from "styled-components";

export const SOptions = styled.div`
  display: block;
  position: absolute;
  border: 1px solid grey;
  background-color: white;
  top: ${({ x }) => x}px;
  left: ${({ y }) => y}px;
  min-width: ${({ width }) => width}px;
`;

export const SOption = styled.div`
  ${({ isActive }) =>
    isActive
      ? `
    background-color: hsl(0deg 0% 80%);
  `
      : undefined}
`;
