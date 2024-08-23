
import './BaziChart.scss';

const BaziChart = ({ baziData }) => {
  if (!baziData) {
    return null;
  }

  return (
    <div className="bazi-chart">
      <table className="bazi-chart__table"> 
        <thead>
          <tr>
            <th>Hour 时</th>
            <th>Day 日</th>
            <th>Month 月</th>
            <th>Year 年</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{baziData.bazi_time}</td>
            <td className='main_column'>{baziData.bazi_day}</td>
            <td>{baziData.bazi_month}</td>
            <td>{baziData.bazi_year}</td>
          </tr>
          <tr>
            <td>{baziData.symbol_time}</td>
            <td className='main_column'>{baziData.symbol_day}</td>
            <td>{baziData.symbol_month}</td>
            <td>{baziData.symbol_year}</td>
          </tr>
          <tr>
            <td></td>
            <td>{baziData.brief}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BaziChart;
