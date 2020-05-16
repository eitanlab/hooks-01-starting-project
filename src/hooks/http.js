import { useReducer, useCallback } from "react";

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
}

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier
      };
    case "RESPONSE":
      return {
        ...curHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra
      };
    case "ERROR":
      return { 
        loading: false, 
        error: action.errorMessage 
      };
    case "CLEAR":
      return { initialState };
    default:
      throw new Error("Should not get there!");
  }
};

const useHttp = () => {
  const [httpState, disptatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => disptatchHttp({type: 'CLEAR'}), []);

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifier) => {
      disptatchHttp({ type: "SEND", identifier: reqIdentifier });
      fetch(url, {
        method,
        body,
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          disptatchHttp({
            type: "RESPONSE",
            responseData,
            extra: reqExtra,
          });
        })
        .catch((error) => {
          console.log(error);
          disptatchHttp({ type: "ERROR", errorMessage: 'Something went wrong!' });
        });
    }, []);

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clear
  };
};

export default useHttp;
