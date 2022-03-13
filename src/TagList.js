import { useEffect, useReducer, useRef, useState } from "react";
import {
  STagListContainer,
  STagItemContainer,
  STagItemLabel,
  STagItemRemove
} from "./STagList";
import { reducer, add, remove, edit } from "./reducer";

export default function TagList({
  onSync,
  initialTags = [],
  FormComponent,
  TagComponent,
  labelFn
}) {
  const [listTags, dispatch] = useReducer(reducer, initialTags);
  const [editIndex, setEditIndex] = useState(undefined);
  const elementToFocusRef = useRef();

  useEffect(() => {
    onSync(listTags);
  }, [listTags, onSync]);

  function handleSubmit(e) {
    e.preventDefault();

    const values = Object.fromEntries(new FormData(e.target).entries());

    if (editIndex != null) {
      dispatch(edit(editIndex, values));
      closeEditTag();
    } else {
      dispatch(add(values));
    }
    elementToFocusRef.current.focus();
  }

  function handleEdit(index) {
    setEditIndex(index);
    if ("focus" in elementToFocusRef.current) {
      elementToFocusRef.current.focus();
    }
  }

  function handleRemove(index) {
    if (editIndex === index) {
      closeEditTag();
    }
    dispatch(remove(index));
  }

  function closeEditTag() {
    setEditIndex(undefined);
  }

  return (
    <>
      <STagListContainer>
        {listTags.map((tag, index) => (
          <TagItem
            key={index}
            onEdit={() => handleEdit(index)}
            onRemove={() => handleRemove(index)}
            isEditing={index === editIndex}
            label={labelFn(tag)}
          >
            <TagComponent {...tag} />
          </TagItem>
        ))}

        <FormComponent
          initialValues={editIndex != null ? listTags[editIndex] : {}}
          onSubmit={handleSubmit}
          ref={elementToFocusRef}
        />

        {editIndex != null && <button onClick={closeEditTag}>Cancel</button>}
      </STagListContainer>
    </>
  );
}

function TagItem({ children, label, onEdit, onRemove, isEditing }) {
  return (
    <STagItemContainer isActive={isEditing}>
      <STagItemLabel
        aria-label={`${label}. Clique para editar`}
        onClick={onEdit}
      >
        {children}
      </STagItemLabel>
      <STagItemRemove
        aria-label={`${label}. Clique para remover`}
        onClick={onRemove}
      >
        x
      </STagItemRemove>
    </STagItemContainer>
  );
}
