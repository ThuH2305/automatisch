import App from '../../models/app';
import Context from '../../types/express/context';
import { IJSONObject } from '@automatisch/types';

type Params = {
  input: {
    key: string;
    formattedData: IJSONObject;
  };
};
const createConnection = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  await App.findOneByKey(params.input.key);

  return await context.currentUser.$relatedQuery('connections').insert({
    key: params.input.key,
    formattedData: params.input.formattedData,
  });
};

export default createConnection;
