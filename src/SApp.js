import styled from "styled-components";

export const SQueryContainer = styled.span`
  max-width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const SForm = styled.form`
  display: inline-flex;
  flex-wrap: nowrap;
  gap: 4px;
`;

export const STagInput = styled.input`
  border: none;
  background-color: hsl(0deg, 0%, 90%);
  width: 80px;
`;
