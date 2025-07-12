import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FilterForm.css';

const langs = [
    { label: 'Vietsub', value: 'vietsub' },
    { label: 'Lồng tiếng', value: 'long-tieng' }
];
const years = Array.from({ length: 16 }, (_, i) => 2025 - i);

const typeListOptions = [
    { label: 'Phim bộ', value: 'phim-bo' },
    { label: 'Phim lẻ', value: 'phim-le' },
    { label: 'TV Shows', value: 'tv-shows' },
    { label: 'Hoạt hình', value: 'hoat-hinh' },
    { label: 'Phim Vietsub', value: 'phim-vietsub' },
    { label: 'Phim Thuyết minh', value: 'phim-thuyet-minh' },
    { label: 'Phim Lồng tiếng', value: 'phim-long-tieng' },
];

const FilterForm = () => {
    const [filters, setFilters] = useState({
        type_list: 'phim-bo',
        country: [],
        category: [],
        sort_lang: [],
        year: [],
    });
    const [countries, setCountries] = useState([]);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resGenres = await axios.get('http://localhost:9999/genres');
                const resCountries = await axios.get('http://localhost:9999/countries');
                setCategories(resGenres.data);
                setCountries(resCountries.data);
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu:', error);
            }
        };
        fetchData();
    }, []);

    const handleSelect = (key, value) => {
        if (key === 'type_list') {
            setFilters((prev) => ({ ...prev, [key]: value }));
            return;
        }
        setFilters(prev => {
            const current = prev[key];
            if (value === '') return { ...prev, [key]: [] };
            const updated = current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value];
            return { ...prev, [key]: updated };
        });
    };

    const isActive = (key, value) => {
        if (key === 'type_list') return filters[key] === value;
        return value === ''
            ? filters[key].length === 0
            : filters[key].includes(value);
    };

    const handleSubmit = () => {
        const queryOrder = ['sort_lang', 'category', 'country', 'year'];
        const queryParts = [];

   
        queryParts.push('page=1');

        queryOrder.forEach((key) => {
            if (filters[key] && filters[key].length > 0) {
                queryParts.push(`${key}=${filters[key].join(',')}`);
            }
        });

        const query = queryParts.join('&');
        navigate(`/loc-phim/${filters.type_list}?${query}`);
    };


    return (
        <div className="filter-box bg-dark text-white p-4 rounded mb-5">
            <h5 className="mb-3"><i className="fas fa-filter"></i> Bộ lọc</h5>

            <div className="filter-group">
                <div className="filter-label">Danh mục:</div>
                <div className="filter-options">
                    {typeListOptions.map((item) => (
                        <button
                            key={item.value}
                            className={isActive('type_list', item.value) ? 'active' : ''}
                            onClick={() => handleSelect('type_list', item.value)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="filter-group">
                <div className="filter-label">Quốc gia:</div>
                <div className="filter-options">
                    <button className={isActive('country', '') ? 'active' : ''} onClick={() => handleSelect('country', '')}>Tất cả</button>
                    {countries.map((c) => (
                        <button key={c.slug} className={isActive('country', c.slug) ? 'active' : ''} onClick={() => handleSelect('country', c.slug)}>
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="filter-group">
                <div className="filter-label">Thể loại:</div>
                <div className="filter-options">
                    <button className={isActive('category', '') ? 'active' : ''} onClick={() => handleSelect('category', '')}>Tất cả</button>
                    {categories.map((c) => (
                        <button key={c.slug} className={isActive('category', c.slug) ? 'active' : ''} onClick={() => handleSelect('category', c.slug)}>
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="filter-group">
                <div className="filter-label">Phiên bản:</div>
                <div className="filter-options">
                    <button className={isActive('sort_lang', '') ? 'active' : ''} onClick={() => handleSelect('sort_lang', '')}>Tất cả</button>
                    {langs.map((lang) => (
                        <button key={lang.value} className={isActive('sort_lang', lang.value) ? 'active' : ''} onClick={() => handleSelect('sort_lang', lang.value)}>
                            {lang.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="filter-group">
                <div className="filter-label">Năm sản xuất:</div>
                <div className="filter-options">
                    <button className={isActive('year', '') ? 'active' : ''} onClick={() => handleSelect('year', '')}>Tất cả</button>
                    {years.map((y) => (
                        <button key={y} className={isActive('year', y.toString()) ? 'active' : ''} onClick={() => handleSelect('year', y.toString())}>
                            {y}
                        </button>
                    ))}
                </div>
            </div>

            <div className="text-end mt-3">
                <button className="filter-submit-btn" onClick={handleSubmit}>Lọc kết quả</button>
            </div>
        </div>
    );
};

export default FilterForm;