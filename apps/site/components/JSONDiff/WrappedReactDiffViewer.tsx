import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";

interface WrappedJSONDiffViewer {
  oldJSON: string;
  newJSON: string;
}

export default function WrappedReactDiffViewer({
  oldJSON,
  newJSON,
}: WrappedJSONDiffViewer) {
  return (
    <div>
      <ReactDiffViewer
        leftTitle="Before"
        rightTitle="Now"
        oldValue={oldJSON}
        newValue={newJSON}
        splitView={true}
        compareMethod={DiffMethod.WORDS}
        useDarkTheme={true}
        styles={
          {
            variables: {
              dark: {
                diffViewerTitleColor: "white",
              },
            },
            codeFold: {
              a: {
                textDecoration: "none !important",
                "&:hover": {
                  textDecoration: "underline !important",
                },
              },
            },
          } as unknown as any
        }
      />
    </div>
  );
}
