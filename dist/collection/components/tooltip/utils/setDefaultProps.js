import { defaultProps } from "../constants";
export const setDefaultProps = (partialProps) => {
    const keys = Object.keys(partialProps);
    keys.forEach((key) => {
        defaultProps[key] = partialProps[key];
    });
};
