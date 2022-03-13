import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import Autocomplete from "./Autocomplete";
import { SQueryContainer, STagInput, SForm } from "./SApp";
import TagList from "./TagList";
import list from "./list.json";

export default function App() {
  return <QueryStringInput href="ifood://webmiddleware" />;
}

function QueryStringInput({ href }) {
  const [queryList, setQueryList] = useState([]);

  const handleSync = useCallback((tagList) => {
    setQueryList(tagList);
  }, []);

  return (
    <>
      <Queries queryList={queryList} href={href} />
      <TagList
        onSync={handleSync}
        initialTags={queryList}
        FormComponent={Form}
        TagComponent={Tag}
        labelFn={({ tagkey, tagvalue }) => `${tagkey}: ${tagvalue}`}
      />
    </>
  );
}

function Queries({ queryList, href }) {
  const queryRef = useRef();

  const fullQuery = useMemo(() => {
    const url = new URL(href);
    url.search = String(
      new URLSearchParams(
        queryList.map((query) => [query.tagkey, query.tagvalue])
      )
    );
    return String(url);
  }, [href, queryList]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fullQuery);
    } catch {
      alert("Could not copy automatically");
    }
  }

  return fullQuery.length ? (
    <>
      <SQueryContainer ref={queryRef}>{fullQuery}</SQueryContainer>
      <button onClick={handleCopy}>Copy</button>
    </>
  ) : null;
}

const Form = forwardRef(({ initialValues, onSubmit }, ref) => {
  const [formKey, setFormKey] = useState(Date.now());
  const [autofocus, setAutofocus] = useState(false);

  const handleSubmit = useCallback(
    (e) => {
      onSubmit(e);
      setFormKey(Date.now());
      setAutofocus(true);
    },
    [onSubmit]
  );

  useEffect(() => {
    if (!autofocus) {
      return;
    }
    if (!ref.current) {
      return;
    }
    ref.current.focus();
    setAutofocus(false);
  }, [formKey, ref, autofocus]);

  return (
    <SForm onSubmit={handleSubmit} key={formKey}>
      <Autocomplete
        InputComponent={STagInput}
        name="tagkey"
        defaultValue={initialValues.tagkey}
        ref={ref}
        placeholder="chave"
        options={list}
        maxLength={20}
        key={initialValues.tagkey}
      />
      <STagInput
        name="tagvalue"
        defaultValue={initialValues.tagvalue}
        placeholder="valor"
      />
      <button type="submit" style={{ display: "none" }} />
    </SForm>
  );
});

function Tag({ tagkey: key, tagvalue: value }) {
  return (
    <>
      <strong>{key}</strong>:{value}
    </>
  );
}
