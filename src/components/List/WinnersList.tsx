import React, { useEffect, useState } from 'react';
import { Input, Select, Table } from 'antd';
import { IMovie } from '../../interfaces/Movie';
import { fetchWinnersByYearSearchRepository } from '../../repositories/WinnersByYearSearchRepository';

const { Option } = Select;

interface TablePaginationConfig {
    current: number;
    pageSize: number;
    total: number;
}

const WinnersList: React.FC = () => {
    const [yearFilter, setYearFilter] = useState<string>('');
    const [winnerFilter, setWinnerFilter] = useState<boolean>(true);
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchMovies();

    }, []);

    useEffect(() => {
        if (
            yearFilter.length === 0 ||
            yearFilter.length === 4 && /^\d{4}$/.test(yearFilter))
            fetchMovies();

    }, [yearFilter]);

    useEffect(() => {
        fetchMovies();
    }, [winnerFilter]);

    const fetchMovies = async () => {
        try {
            setLoading(true);

            const { current, pageSize } = pagination;

            const { content, totalElements } = await fetchWinnersByYearSearchRepository({
                page: current,
                pageSize,
                year: yearFilter,
                winner: winnerFilter,
            });

            setMovies(content);
            setPagination(prev => ({
                ...prev,
                total: totalElements,
            }));
        } catch (error) {
            console.error('Error fetching winners by year:', error);
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPagination({
            current: 1,
            pageSize: 5,
            total: 0
        });
        setYearFilter(e.target.value);
    }

    const handleWinnerChange = (value: string) => {
        setPagination({
            current: 1,
            pageSize: 5,
            total: 0
        });
        setWinnerFilter(value == 'Yes' ? true : false);
    }

    const handleTableChange = (newPagination: TablePaginationConfig, filters: IMovie) => {
        if (!filters.year)
            setYearFilter('');

        setPagination(newPagination);
        fetchMovies();
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a: IMovie, b: IMovie) => a.title.localeCompare(b.title),
        },
        {
            title: 'Year',
            dataIndex: 'year',
            key: 'year',
            sorter: (a: IMovie, b: IMovie) => a.year - b.year,
            filterDropdown: () => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search year"
                        value={yearFilter}
                        onChange={handleYearChange}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                        data-testid="year-search-input"
                    />
                </div>
            ),
        },
        {
            title: 'Studios',
            dataIndex: 'studios',
            key: 'studios',
            render: (studios: string[]) => studios.join(', '),
            sorter: (a: IMovie, b: IMovie) => a.studios.sort().join(', ').localeCompare(b.studios.sort().join(', ')),
        },
        {
            title: 'Producers',
            dataIndex: 'producers',
            key: 'producers',
            render: (producers: string[]) => producers.join(', '),
            sorter: (a: IMovie, b: IMovie) => a.producers.sort().join(', ').localeCompare(b.producers.sort().join(', ')),
        },
        {
            title: 'Winner',
            dataIndex: 'winner',
            key: 'winner',
            render: (winner: boolean) => (winner ? 'Yes' : 'No'),
            sorter: (a: IMovie, b: IMovie) => Number(a.winner) - Number(b.winner),
            filterDropdown: () => (
                <div style={{ padding: 8 }}>
                    <Select
                        placeholder="Select winner"
                        value={winnerFilter}
                        onChange={handleWinnerChange}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                        data-testid="winner-select"
                    >
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                    </Select>
                </div>
            ),
        }
    ];

    return (
        <div className="p-4 bg-[#3b3b3b] shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-[#fff]">List movies</h2>
            {
                error
                    ? <p className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </p>
                    :
                    <>
                        <div className="flex gap-4 items-center mb-4">
                            <h4 className="text-[100%] font-bold text-white">Year Filter:</h4>
                            <Input
                                placeholder="Year filter"
                                value={yearFilter}
                                onChange={handleYearChange}
                                className="w-48"
                            />
                            <h4 className="text-[100%] font-bold text-white">Winner Filter:</h4>
                            <Select
                                placeholder="Winner filter"
                                value={winnerFilter}
                                onChange={handleWinnerChange}
                                className="w-48"
                            >
                                <Option value="Yes">Yes</Option>
                                <Option value="No">No</Option>
                            </Select>
                        </div>

                        <Table
                            columns={columns}
                            dataSource={movies}
                            rowKey={record => record.id}
                            pagination={pagination}
                            loading={loading}
                            onChange={handleTableChange}
                            scroll={{ x: 768 }}
                        />
                    </>
            }
        </div>
    );
};

export default WinnersList;
