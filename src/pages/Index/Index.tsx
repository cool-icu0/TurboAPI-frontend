import {PageContainer} from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import {List, message} from "antd";
import {listInterfaceInfoByPageUsingGet} from "@/services/TurboAPI-backend/interfaceInfoController";

/**
 * 主页
 * @constructor
 */
const Index: React.FC = () => {
    //加载状态
    const [loading, setLoading] = useState(false);
    //列表数据
    const [list, setList] = useState<API.InterfaceInfo[]>([]);
    //总数
    const [total, setTotal] = useState<number>(0);

    const loadData = async (current = 1, pageSize = 5) => {
      setLoading(true);
      try {
        const res = await listInterfaceInfoByPageUsingGet({
          current,
          pageSize,
        });
        setList(res?.data?.records || []);
        setTotal(res?.data?.total ?? 0);
      } catch (error: any) {
        message.error('请求失败' + error.message);
      }
      setLoading(false);
    }
    useEffect(() => {
      loadData();
    }, []);
    return (
      <PageContainer title="Turbo API接口管理平台">
        <List
          className="my-list"
          loading={loading}
          itemLayout="horizontal"
          dataSource={list}
          renderItem={(item) => {
            const apiLink = `/interface_info/${item.id}`;
            return(
              <List.Item actions={[<a key={item.id} href={apiLink} >查看</a>]}>
                <List.Item.Meta
                  title={<a href={apiLink}>{item.name}</a>}
                  description={item.description}
                />
              </List.Item>
            );
          }}
          //分页配置
          pagination={{
            //自定义显示总数
            showTotal(total: number) {
              return '总数' + total;
            },
            pageSize: 5,
            total,
            //切换页面触发的回调函数
            onChange(page, pageSize) {
              //加载对应页面的数据
              loadData(page, pageSize);
            },
          }}
        />
      </PageContainer>
    );
};

export default Index;
