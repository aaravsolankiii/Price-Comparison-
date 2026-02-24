let currentProduct = null;

async function searchProduct() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const response = await fetch("products.json");
  const data = await response.json();

  const product = data.find(p => p.name.includes(input));

  if (!product) {
    document.getElementById("result").innerHTML = "<p>Product not found</p>";
    return;
  }

  currentProduct = product;
  document.getElementById("pdfBtn").style.display = "inline-block";

  const prices = [product.amazon, product.flipkart, product.croma];
  const minPrice = Math.min(...prices);

  document.getElementById("result").innerHTML = `
    <table>
      <tr>
        <th>Platform</th>
        <th>Price (₹)</th>
        <th>Buy</th>
      </tr>
      <tr class="${product.amazon === minPrice ? 'cheapest' : ''}">
        <td>Amazon</td>
        <td>${product.amazon}</td>
        <td><button onclick="alert('Redirecting to Amazon')">Buy</button></td>
      </tr>
      <tr class="${product.flipkart === minPrice ? 'cheapest' : ''}">
        <td>Flipkart</td>
        <td>${product.flipkart}</td>
        <td><button onclick="alert('Redirecting to Flipkart')">Buy</button></td>
      </tr>
      <tr class="${product.croma === minPrice ? 'cheapest' : ''}">
        <td>Croma</td>
        <td>${product.croma}</td>
        <td><button onclick="alert('Redirecting to Croma')">Buy</button></td>
      </tr>
    </table>
  `;

  drawChart(product.history);
}

function drawChart(history) {
  const ctx = document.getElementById("priceChart").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Today"],
      datasets: [{
        label: "Price Trend",
        data: history,
        borderWidth: 2
      }]
    }
  });
}

function downloadPDF() {
  if (!currentProduct) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("FlashCompare Price Comparison", 20, 20);
  doc.text(`Product: ${currentProduct.name}`, 20, 30);
  doc.text(`Amazon: ₹${currentProduct.amazon}`, 20, 40);
  doc.text(`Flipkart: ₹${currentProduct.flipkart}`, 20, 50);
  doc.text(`Croma: ₹${currentProduct.croma}`, 20, 60);

  doc.save("price-comparison.pdf");
}
