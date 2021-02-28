const {
  utility,
  backEnd: {
    management: { authentication },
    persistence: { UnitOfWork, databases },
  },
} = require("@ciro-maciel/utility");

const { TABLE_NAME } = process.env;

const uow = new UnitOfWork(new databases.Dynamo(), TABLE_NAME);

exports.handler = async (event, context) => {
  try {
    switch (event.httpMethod) {
      case "POST": {
        return context.succeed(
          utility.http.response({ uploadURL: await imageUploadURL(event.body) })
        );
      }
      case "GET": {
        const { url = "http://ciro-maciel.me/" } = event.queryStringParameters;

        return context.succeed(
          utility.http.response(await linkInformation(url))
        );
        // return context.succeed(
        //   utility.http.response({
        //     method: event.httpMethod,
        //     message: "workspace - ciro-maciel - services",
        //   })
        // );
      }
      default:
        return context.succeed(
          utility.http.response({ method: event.httpMethod })
        );
    }
  } catch (error) {
    return context.succeed(
      utility.http.response({
        method: event.httpMethod,
        // message: "workspace - ciro-maciel - services",
        message: error.message,
      })
    );
  }
};
