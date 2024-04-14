import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { IProducerInterval } from '../../interfaces/ProducerInterval';
import { fetchProducerIntervalsRepository } from '../../repositories/ProducersWithWinIntervalRepository';

const ProducersWithWinInterval: React.FC = () => {
    const [minData, setMinData] = useState<IProducerInterval[]>([]);
    const [maxData, setMaxData] = useState<IProducerInterval[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchIntervals = async () => {
        try {
            setLoading(true);
            const { min, max } = await fetchProducerIntervalsRepository();
            setMinData(min);
            setMaxData(max);
        } catch (error) {
            console.error('Error fetching producer intervals:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIntervals();
    }, []);

    const columns = [
        {
            title: 'Producer',
            dataIndex: 'producer',
            key: 'producer',
        },
        {
            title: 'Interval',
            dataIndex: 'interval',
            key: 'interval',
        },
        {
            title: 'Previous Win',
            dataIndex: 'previousWin',
            key: 'previousWin',
        },
        {
            title: 'Following Win',
            dataIndex: 'followingWin',
            key: 'followingWin',
        },
    ];

    return (
        <div className="p-4 bg-[#3b3b3b] shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Producers with Longest and Shortest Intervals Between Wins</h2>
            <div style={{ display: 'flex', justifyContent: 'center',  flexDirection: 'column'}}>
                <div>
                    <h3 className="text-lg mb-2 text-white">Maximum</h3>
                    <Table
                        columns={columns}
                        dataSource={minData}
                        pagination={false}
                        rowKey="producer"
                        loading={loading}
                        onChange={fetchIntervals}
                        scroll={{ x: 768 }}
                    />
                </div>
                <div>
                    <h3 className="text-lg mb-2 text-white">Minimum</h3>
                    <Table
                        columns={columns}
                        dataSource={maxData}
                        pagination={false}
                        rowKey="producer"
                        loading={loading}
                        onChange={fetchIntervals}
                        scroll={{ x: 768 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProducersWithWinInterval;
