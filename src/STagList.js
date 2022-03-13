import styled from "styled-components";

export const STagListContainer = styled.div`
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  gap: 2px;
  border: 1px solid grey;
  padding: 8px;
`;

export const STagItemContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  border-radius: 50000px;
  border: solid 2px transparent;
  ${({ isActive }) =>
    isActive
      ? `
    border-color: blue;
  `
      : ""}
`;

export const STagItemLabel = styled.button`
  border: none;
  padding: 4px 8px;
  background: hsl(0deg, 0%, 90%);
  border-radius: 50000px 0 0 50000px;
  :hover,
  :focus-visible {
    background: hsl(0deg, 0%, 30%);
    color: hsl(0deg, 0%, 100%);
  }
`;

export const STagItemRemove = styled.button`
  background: hsl(0deg, 0%, 90%);
  border-radius: 0 50000px 50000px 0;
  border: none;
  width: 20px;
  :hover,
  :focus-visible {
    background: hsl(0deg, 0%, 30%);
    color: hsl(0deg, 0%, 100%);
  }
`;
