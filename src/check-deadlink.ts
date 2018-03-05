import {Padex, Document, PadexOptions} from 'padex';

declare namespace checkDeadlink {
  export interface Result {
    document: Document;
    from: Document[];
  }
}

const checkDeadlink = async (url: string, options: PadexOptions = {}) => {
  const padex = new Padex(url, options);

  const result = await padex.process();

  const documentsWithError = result.documents.filter(d => d.isError());
  const parentDocumentsHasErrorChild = documentsWithError.map(documentWithError => {
    return result.documents.filter(d => d.hasChild(documentWithError));
  });

  return documentsWithError.reduce((acc, document, idx) => {
    acc[document.normalizedUrl] = {
      document,
      from: parentDocumentsHasErrorChild[idx],
    };

    return acc;
  }, {} as any);
};

export = checkDeadlink;
