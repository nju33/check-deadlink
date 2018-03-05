declare module 'serve' {
  // tslint:disable-next-line
  function serve(path: string, options?: serve.Options): serve.Disposable;

  namespace serve {
    interface Options {
      auth?: boolean;
      cache?: number;
      clipless?: boolean;
      cors?: boolean;
      ignore?: string[];
      local?: boolean;
      open?: boolean;
      port?: number;
      silent?: boolean;
      single?: boolean;
      ssl?: boolean;
      treeless?: boolean;
      unzipped?: boolean;
    }
    interface Disposable {
      stop(): any
    }
  }

  export = serve;
}
