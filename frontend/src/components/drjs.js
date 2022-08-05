import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const DRJS_JS_URL = 'https://js.digitalriver.com/v1/DigitalRiver.js';
const DRJS_CSS_URL = 'https://js.digitalriver.com/v1/css/DigitalRiver.css';

let drjs;
let js_script;
let css_link;

const DrjsContext = createContext({});

export default function DrjsWrapper({
  APIKey,
  locale = 'en-us',
  billingAddress,
  sessionId,
  sourceData,
  refreshSource,
  returnSource = () => {},
  children,
}) {
  const [digitalRiver, setDigitalRiver] = useState();
  const [source, setSource] = useState();
  const [elements, setElements] = useState({});

  const createSource = async (element, options) => {
    let sourceArgs = [];
    if (element) {
      sourceArgs.push(element);
    }
    const data = Object.assign(
      {
        sessionId: sessionId,
        owner: billingAddress,
      },
      options
    );
    sourceArgs.push(data);
    const source = await digitalRiver.createSource.apply(
      digitalRiver,
      sourceArgs
    );
    setSource(source);
    returnSource(source);
    return source;
  };

  const initDRJS = () => {
    if (!digitalRiver && window.DigitalRiver && APIKey) {
      drjs = new window.DigitalRiver(APIKey, { locale: locale });
      setDigitalRiver(drjs);
    }
  };

  const clearDigitalRiver = () => {
    setDigitalRiver(null);
  };

  const setElement = (name, element) => {
    setElements(Object.assign({}, elements, { [name]: element }));
  };

  useEffect(() => {
    return () => {
      if (js_script) {
        document.head.removeChild(js_script);
        js_script = null;
      }
      if (css_link) {
        document.head.removeChild(css_link);
        css_link = null;
      }
    };
  }, []);

  useEffect(() => {
    if (digitalRiver === null) {
      if (!js_script) {
        js_script = document.createElement('script');
        js_script.src = DRJS_JS_URL;
        js_script.async = true;
        js_script.onload = () => initDRJS();
        document.head.appendChild(js_script);

        css_link = document.createElement('link');
        css_link.rel = 'stylesheet';
        css_link.type = 'text/css';
        css_link.href = DRJS_CSS_URL;
        document.head.appendChild(css_link);
        return () => {};
      } else {
        initDRJS();
      }
    }
  }, [digitalRiver]);

  useEffect(() => {
    clearDigitalRiver();
  }, [APIKey, locale, sessionId, billingAddress]);

  useEffect(() => {
    if (sourceData && sourceData.type) {
      switch (sourceData.type) {
        case 'creditCard':
          if (elements.cardcvv) {
            createSource(elements.cardcvv, sourceData);
          }
          break;
        default:
          createSource(null, sourceData);
          break;
      }
    }
  }, [sourceData]);

  const mounted = useRef(false);
  let sourceRunning = false;
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      if (source && digitalRiver && !sourceRunning) {
        sourceRunning = true;
        digitalRiver
          .retrieveSource(source.source.id, source.source.clientSecret)
          .then((_source) => {
            setSource(_source);
            returnSource(_source);
            sourceRunning = false;
          });
      }
    }
  }, [refreshSource]);

  const sharedState = {
    digitalRiver,
    clearDigitalRiver,
    createSource,
    setElement,
    setSource,
    source,
    billingAddress,
    sessionId,
  };
  return (
    <DrjsContext.Provider value={sharedState}>{children}</DrjsContext.Provider>
  );
}

export function useDrjsContext() {
  return useContext(DrjsContext);
}
