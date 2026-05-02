import PortfolioLayout from "./PortfolioLayout";

export default function LivePortfolioPreview({ data }) {
  return (
    <section className="card preview-card">
      <div className="preview-header">
        <div>
          <span className="eyebrow">Live Preview</span>
          <h2>What the portfolio looks like right now</h2>
        </div>
      </div>
      <PortfolioLayout data={data} mode="preview" />
    </section>
  );
}