/// <reference types="vite/client" />

// 1. CSS 모듈 인식
declare module '*.css';

// 2. TUI Grid 관련 타입 에러 무시
declare module 'tui-grid' {
  const Grid: any;
  export default Grid;
  export type Grid = any;
  export type OptRow = any;
}

declare module '@toast-ui/react-grid' {
  import { Component } from 'react';
  export default class Grid extends Component<any> {
    getInstance(): any;
  }
}

// PrismJS 타입 선언
declare module 'prismjs' {
  const Prism: any;
  export default Prism;
}
