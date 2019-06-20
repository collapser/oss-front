import axios from '../config';

/**
 *  获取 Bucket 列表
 * @returns {Promise<AxiosResponse<any> | never>}
 * @constructor
 */
export const ListBucketApi = params => axios.get('/ajax/bucket/list.json', { params })
  .then(res => res.data);

/**
 * 获取 Bucket 详情
 * @param params
 * @returns {Promise<AxiosResponse<any> | never>}
 * @constructor
 */
export const GetBucketApi = params => axios.get('/ajax/bucket/detail.json', { params })
  .then(res => res.data);

/**
 * 创建 Bucket
 * @returns {Promise<AxiosResponse<any> | never>}
 * @constructor
 */
export const CreateBucketApi = params => axios.post('/ajax/bucket/new_create_bucket.json', params)
  .then(res => res.data);
