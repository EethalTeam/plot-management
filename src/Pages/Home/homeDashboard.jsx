import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function HomeDashboard() {
    const salesData = [
        { value: 0, label: "Qty", status: "TO BE PACKED", color: "#1E90FF" }, // Blue
        { value: 0, label: "Pkgs", status: "TO BE SHIPPED", color: "#FF4D4D" }, // Red
        { value: 0, label: "Pkgs", status: "TO BE DELIVERED", color: "#28A745" }, // Green
        { value: 0, label: "Qty", status: "TO BE INVOICED", color: "#FFC107" }, // Yellow
    ];

    const inventoryData = [
        { label: "QUANTITY IN HAND", value: 0 },
        { label: "QUANTITY TO BE RECEIVED", value: 0 },
    ];
    const PurchaseData = [
        { label: "Quantity Ordered", value: 0, color: "#1E90FF" },
        { label: "Total Cost", value: 0, color: "#1E90FF" },
    ];
    const Product = [
        { label: "Low Plot Items", value: 0, color: "#FF4D4D" },
        { label: "All Item Groups", value: 0 },
        { label: "All Items", value: 0 },
    ]
    const SalesOrder = [
        { label: "Channel", },
        { label: "Draft", },
        { label: "Confirmed", },
        { label: "Packed", },
        { label: "Shipped", },
        { label: "Invoiced", },
    ]
    const data = [
        { date: "01 Feb", sales: 0 },
        { date: "03 Feb", sales: 0 },
        { date: "05 Feb", sales: 0 },
        { date: "07 Feb", sales: 0 },
        { date: "09 Feb", sales: 0 },
        { date: "11 Feb", sales: 0 },
        { date: "13 Feb", sales: 0 },
        { date: "15 Feb", sales: 0 },
        { date: "17 Feb", sales: 0 },
        { date: "19 Feb", sales: 0 },
        { date: "21 Feb", sales: 0 },
        { date: "23 Feb", sales: 0 },
        { date: "25 Feb", sales: 0 },
        { date: "27 Feb", sales: 0 },
    ];

    return (
        <div className='homedashboardMain'>
            <div className="dashboard-container">
                {/* Sales Activity Section */}
                <div className="sales-container">
                    <h3 className="section-title">Sales Activity</h3>
                    <div className="sales-grid">
                        {salesData.map((item, index) => (
                            <div className="sales-card" key={index}>
                                <span className="sales-value" style={{ color: item.color }}>
                                    {item.value}
                                </span>
                                <span className="sales-label">{item.label}</span>
                                <span className="sales-status">{item.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inventory Summary Section */}
                <div className="inventory-container">
                    <h3 className="section-title">Inventory Summary</h3>
                    <div className="inventory-content">
                        {inventoryData.map((item, index) => (
                            <div className="inventory-item" key={index}>
                                <span className="inventory-label">{item.label}</span>
                                <span className="inventory-value">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="ProductDetails-container">
                {/* Product Details Section */}
                <div className="Product-container">
                    <h3 className="section-title">Product Details</h3>
                    <div className='ProductDivMAin'>
                        <div className="Product-grid">
                            {Product.map((item, index) => (
                                <div className="Product-card" key={index} style={{ color: item.color }}>
                                    <span className="Product-value" style={{ color: item.color }}>
                                        {item.label}
                                    </span>
                                    <span className="sales-label" style={{ color: item.color }}>{item.value}</span>
                                </div>
                            ))}

                        </div>
                        <div className='Product-Activity'>
                            <span className="Product-title">Active Items</span>
                            <div className='circleDiv'>
                                <span className="Product-status">No Active Items</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Selling Summary Section */}
                <div className="Selling-container">
                    <h3 className="section-title">Top Selling Items</h3>
                    <div className="Summary-content">
                        <div>No items were invoiced in this time frame</div>
                    </div>
                </div>
            </div>
            <div className="Purchase-container">
                {/* Purchase Order Section */}
                <div className="inventory-container">
                    <h3 className="section-title">Purchase Order</h3>
                    <div className="inventory-content">
                        {PurchaseData.map((item, index) => (
                            <div className="Purchase-item" key={index}>
                                <span className="inventory-label">{item.label}</span>
                                <span className="inventory-value" >{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Sales Order  Section */}
                <div className="sales-container">
                    <h3 className="section-title">Sales Order</h3>
                    <table className="sales-table">
                        <thead>
                            <tr>
                                {SalesOrder.map((item, index) => (
                                    <th key={index}>{item.label}</th>
                                ))}
                            </tr>
                        </thead>
                    </table>
                    <div className="Summary-content">
                        <div>No sales were made in this time frame</div>
                    </div>
                </div>
            </div>
            <div className="sales-chart-container">
                <div className='DivForpadding'>
                    <div className="chart-header">
                        <div>Sales Order Summary (in INR)</div>
                        <select className="filter-dropdown">
                            <option>This Month</option>
                            <option>Last Month</option>
                        </select>
                    </div>
                </div>
                <div className="chart-content">
                    <ResponsiveContainer width="70%" height={300} className="paddingRes">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className='total-sales-parent'>
                        <div className="total-sales">
                            <div>Total Sales</div>
                            <div className="sales-box">
                                <span className="sales-dot"></span>
                                <span className="sales-label">DIRECT SALES</span>
                                <div>Rs.0.00</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
