/* eslint no-unused-expressions:'off', @typescript-eslint/no-unused-expressions: 'error' */
import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { SOption, SOptions } from "./SAutocomplete";

const Autocomplete = forwardRef(
  (
    {
      options,
      maxLength,
      InputComponent,
      onChange,
      onBlur,
      onFocus,
      defaultValue,
      ...rest
    },
    ref
  ) => {
    const [filterTerm, setFilterTerm] = useState(defaultValue ?? "");
    const [finished, setFinished] = useState(false);
    const inputRef = useRef();
    const filteredOptions = useMemo(() => {
      return options
        .filter((option) => option.includes(filterTerm))
        .slice(0, maxLength);
    }, [options, maxLength, filterTerm]);

    const handleChange = useCallback(
      (e) => {
        setFilterTerm(e.target.value);
        setFinished(false);
        onChange?.(e);
      },
      [onChange]
    );

    const handleBlur = useCallback(
      (e) => {
        setFinished(true);
        onBlur?.(e);
      },
      [onBlur]
    );

    const handleFocus = useCallback(
      (e) => {
        setFinished(false);
        onFocus?.(e);
      },
      [onFocus]
    );

    const handleSubmit = useCallback((value) => {
      setFilterTerm(value);
      setFinished(true);
    }, []);

    const showOptions = !finished && filteredOptions.length > 0;

    return (
      <>
        <InputComponent
          {...rest}
          value={filterTerm}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          ref={(target) => {
            ref.current = target;
            inputRef.current = target;
          }}
        />
        {showOptions ? (
          <Anchored anchorRef={inputRef}>
            <SelectOption
              inputRef={inputRef}
              options={filteredOptions}
              onSubmit={handleSubmit}
            />
          </Anchored>
        ) : null}
      </>
    );
  }
);
export default Autocomplete;

function Anchored({ anchorRef, children }) {
  const [bounds, setBounds] = useState();

  useLayoutEffect(() => {
    if (!anchorRef.current) {
      setBounds(undefined);
    }
    setBounds(anchorRef.current.getBoundingClientRect());
  }, [anchorRef]);

  if (!bounds) {
    return null;
  }

  return (
    <SOptions x={bounds.bottom} y={bounds.left} width={bounds.width}>
      {children}
    </SOptions>
  );
}

function SelectOption({ inputRef, options, onSubmit }) {
  const [selected, setSelected] = useState(undefined);

  const handleSubmit = useCallback(() => {
    onSubmit(options[selected]);
  }, [onSubmit, options, selected]);

  const optionsLength = options?.length;

  useLayoutEffect(() => {
    if (!inputRef.current) {
      return;
    }
    /** @type {HTMLInputElement} */
    const elem = inputRef.current;
    const callback = createCallback({
      ArrowUp: (event) => {
        event.preventDefault();
        setSelected((st) => {
          if (st === undefined) {
            return optionsLength - 1;
          }
          return st - 1 >= 0 ? st - 1 : optionsLength - 1;
        });
      },
      ArrowDown: (event) => {
        event.preventDefault();
        setSelected((st) => {
          if (st === undefined) {
            return 0;
          }
          return (st + 1) % optionsLength;
        });
      },
      Enter: (e) => {
        e.preventDefault();
        handleSubmit();
      }
    });
    elem.addEventListener("keydown", callback);
    return () => {
      elem.removeEventListener("keydown", callback);
    };
  }, [inputRef, handleSubmit, optionsLength]);

  return (
    <div>
      {options.map((opt, i) => (
        <SOption key={opt} isActive={i === selected}>
          {opt}
        </SOption>
      ))}
    </div>
  );
}

const createCallback = (callbackObject) => (event) => {
  if (event.key in callbackObject) {
    callbackObject[event.key](event);
  }
};
