document.addEventListener('DOMContentLoaded', () => {
  // Get all buttons
  const printBtn = document.getElementById('printBtn');
  const pdfBtn = document.getElementById('pdfBtn');
  const customPrintBtn = document.getElementById('customPrintBtn');
  const getPrintersBtn = document.getElementById('getPrintersBtn');
  const printerSelect = document.getElementById('printerSelect');
  const printWithPrinterBtn = document.getElementById('printWithPrinterBtn');
  const statusDiv = document.getElementById('status');

  // Print button
  printBtn.addEventListener('click', async () => {
    try {
      const result = await window.electronAPI.printPage();
      showStatus(result.success, result.error);
    } catch (error) {
      showStatus(false, error.message);
    }
  });

  // Print to PDF button
  pdfBtn.addEventListener('click', async () => {
    try {
      const result = await window.electronAPI.printToPDF();
      showStatus(result.success, result.error);
    } catch (error) {
      showStatus(false, error.message);
    }
  });

  // Custom print button
  customPrintBtn.addEventListener('click', async () => {
    try {
      const result = await window.electronAPI.customPrint({
        landscape: true,
        margins: { marginType: 'none' }
      });
      showStatus(result.success, result.error);
    } catch (error) {
      showStatus(false, error.message);
    }
  });

  // Get printers button
  getPrintersBtn.addEventListener('click', async () => {
    try {
      const result = await window.electronAPI.getPrinters();
      if (result.success) {
        populatePrinters(result.printers);
        showStatus(true, `Found ${result.printers.length} printers`);
      } else {
        showStatus(false, result.error);
      }
    } catch (error) {
      showStatus(false, error.message);
    }
  });

  // Print with selected printer button
  printWithPrinterBtn.addEventListener('click', async () => {
    const printerName = printerSelect.value;
    if (!printerName) {
      showStatus(false, 'Please select a printer first');
      return;
    }

    try {
      const result = await window.electronAPI.printWithPrinter(printerName);
      showStatus(result.success, result.error);
    } catch (error) {
      showStatus(false, error.message);
    }
  });

  // Printer select change handler
  printerSelect.addEventListener('change', () => {
    printWithPrinterBtn.disabled = !printerSelect.value;
  });

  // Handle print shortcut from main process
  window.addEventListener('message', (event) => {
    if (event.data.type === 'print-request') {
      printBtn.click();
    }
  });

  // Helper functions
  function populatePrinters(printers) {
    printerSelect.innerHTML = '<option value="">Select a printer</option>';
    printers.forEach(printer => {
      const option = document.createElement('option');
      option.value = printer.name;
      option.textContent = `${printer.name} (${printer.status})`;
      printerSelect.appendChild(option);
    });
    printerSelect.disabled = printers.length === 0;
    printWithPrinterBtn.disabled = true;
  }

  function showStatus(success, message) {
    statusDiv.textContent = message || (success ? 'Operation successful' : 'Operation failed');
    statusDiv.className = `status ${success ? 'success' : 'error'}`;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 5000);
  }
});