// 图表JavaScript文件 - 使用Chart.js实现数据可视化

// 全局图表实例存储
let ageChart = null;
let interventionChart = null;

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 页面加载完成后初始化图表
    initializeCharts();
});

// 初始化所有图表
function initializeCharts() {
    loadChartData()
        .then(data => {
            createAgeChart(data.agePressureUlcerData);
            createInterventionChart(data.interventionComparisonData);
            setupChartResponsiveness();
        })
        .catch(error => {
            console.error('图表数据加载失败:', error);
            displayChartError('图表数据加载失败，请刷新页面重试。');
        });
}

// 加载图表数据
function loadChartData() {
    return fetch('data/statistics.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('统计数据加载失败');
            }
            return response.json();
        });
}

// 创建年龄与压疮发生率图表
function createAgeChart(chartData) {
    const ctx = document.getElementById('ageChart');
    if (!ctx) return;
    
    // 销毁现有图表实例
    if (ageChart) {
        ageChart.destroy();
    }
    
    ageChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: chartData.datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '老年患者压疮发生率随年龄变化趋势',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 12
                        },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 12
                    },
                    padding: 10
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '压疮发生率 (%)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '年龄分组',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 45,
                        autoSkip: true,
                        maxTicksLimit: 10
                    },
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            },
            elements: {
                line: {
                    tension: 0.4
                },
                point: {
                    radius: 5,
                    hoverRadius: 7
                }
            }
        }
    });
}

// 创建干预措施效果对比图表
function createInterventionChart(chartData) {
    const ctx = document.getElementById('interventionChart');
    if (!ctx) return;
    
    // 销毁现有图表实例
    if (interventionChart) {
        interventionChart.destroy();
    }
    
    interventionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: chartData.datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '不同干预措施对压疮发生率的影响',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 12
                        },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 12
                    },
                    padding: 10,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 30,
                    title: {
                        display: true,
                        text: '压疮发生率 (%)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '干预措施类型',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 45,
                        autoSkip: true,
                        maxTicksLimit: 8
                    },
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// 设置图表响应式行为
function setupChartResponsiveness() {
    // 窗口大小改变时重新渲染图表
    window.addEventListener('resize', debounce(function() {
        if (ageChart) {
            ageChart.resize();
        }
        if (interventionChart) {
            interventionChart.resize();
        }
    }, 250));
    
    // 监听图表容器的可见性变化
    const chartObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && (ageChart || interventionChart)) {
                // 图表进入视口时触发重绘
                setTimeout(() => {
                    if (ageChart) ageChart.update('none');
                    if (interventionChart) interventionChart.update('none');
                }, 100);
            }
        });
    }, { threshold: 0.1 });
    
    const chartContainers = document.querySelectorAll('.chart-wrapper');
    chartContainers.forEach(container => {
        chartObserver.observe(container);
    });
}

// 显示图表错误信息
function displayChartError(message) {
    const chartContainers = document.querySelectorAll('.chart-wrapper');
    
    chartContainers.forEach(container => {
        const canvas = container.querySelector('canvas');
        if (canvas) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'chart-error';
            errorDiv.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <p style="margin-bottom: 10px;">📊 图表加载失败</p>
                    <p style="font-size: 14px;">${message}</p>
                </div>
            `;
            canvas.parentNode.replaceChild(errorDiv, canvas);
        }
    });
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 导出图表数据功能（可选）
function exportChartData() {
    return {
        ageChart: ageChart ? ageChart.data : null,
        interventionChart: interventionChart ? interventionChart.data : null
    };
}

// 图表工具提示自定义样式
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(30, 136, 229, 0.9)';
Chart.defaults.plugins.tooltip.titleColor = '#fff';
Chart.defaults.plugins.tooltip.bodyColor = '#fff';
Chart.defaults.plugins.tooltip.borderColor = 'rgba(255, 255, 255, 0.2)';
Chart.defaults.plugins.tooltip.borderWidth = 1;

// 全局图表配置
Chart.defaults.font.family = "'Helvetica Neue', Arial, 'Microsoft YaHei', sans-serif";
Chart.defaults.color = '#666';
Chart.defaults.borderColor = 'rgba(0, 0, 0, 0.1)';