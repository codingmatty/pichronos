import React from 'react';
import App, { Container } from 'next/app';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    font-size: 12px;
    font-family: sans-serif;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    margin: 0;
    padding: 0;
    font-size: 1.25rem;
    line-height: 2;
  }

  #__next {
    height: 100vh;
    width: 100%;
    position: relative;
  }
`;

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <GlobalStyle />
        <Component {...pageProps} />
      </Container>
    );
  }
}
