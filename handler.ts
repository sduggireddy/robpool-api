// export const hello = async (event, context, cb) => cb(null,
//   { message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!', event }
// );

export const hello = async (event, context, cb) => {
  cb(null,
    { message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!', event }
  );
}