const QRCode = require('qrcode');

async function testQRCode() {
  try {
    // Test QR code generation
    const qrCodeSvg = await QRCode.toString('http://localhost:3000', {
      type: 'svg',
      width: 80,
      margin: 0,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    console.log('QR Code generation successful!');
    console.log('QR Code SVG length:', qrCodeSvg.length);
    console.log('QR Code contains localhost:3000:', qrCodeSvg.includes('localhost:3000') ? 'No (encoded)' : 'URL is encoded in binary');
    console.log('QR Code SVG structure looks valid:', qrCodeSvg.includes('<svg') && qrCodeSvg.includes('</svg>'));
    
    // Show the first part of the SVG
    console.log('\nFirst 200 characters of SVG:');
    console.log(qrCodeSvg.substring(0, 200) + '...');
    
  } catch (error) {
    console.error('QR Code generation failed:', error);
  }
}

testQRCode();