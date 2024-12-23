import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import StockForm from './components/StockForm';
import StockList from './components/StockList';
import axios from 'axios';

function App() {
    const [stocks, setStocks] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const [topStock, setTopStock] = useState('');

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/stocks');
            setStocks(response.data);
            calculateMetrics(response.data);
        } catch (error) {
            console.error('Error fetching stocks:', error);
        }
    };

    const calculateMetrics = (stocks) => {
        let total = 0;
        let top = { name: '', value: 0 };

        stocks.forEach((stock) => {
            const stockValue = stock.quantity * stock.buyPrice;
            total += stockValue;

            if (stockValue > top.value) {
                top = { name: stock.stockName, value: stockValue };
            }
        });

        setTotalValue(total);
        setTopStock(top.name);
    };

    const handleAddStock = async (stock) => {
        try {
            const response = await axios.post('http://localhost:8080/api/stocks', stock);
            setStocks([...stocks, response.data]);
            calculateMetrics([...stocks, response.data]);
        } catch (error) {
            console.error('Error adding stock:', error);
        }
    };

    const handleDeleteStock = async (id) => {
        try {
            await axios.delete('http://localhost:8080/api/stocks/${id}');
            const updatedStocks = stocks.filter((stock) => stock.id !== id);
            setStocks(updatedStocks);
            calculateMetrics(updatedStocks);
        } catch (error) {
            console.error('Error deleting stock:', error);
        }
    };

    return (
        <div>
            <Dashboard totalValue={totalValue} topStock={topStock} />
            <StockForm onSubmit={handleAddStock} />
            <StockList stocks={stocks} onEdit={() => {}} onDelete={handleDeleteStock} />
        </div>
    );
}

export default App;