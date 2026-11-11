/**
 * SalaryPathGuide.com - Google Sheets Webhook Collector
 * 
 * -----------------------------------------------------------------------------
 * 1-MINUTE SETUP INSTRUCTIONS:
 * -----------------------------------------------------------------------------
 * 1. Open Google Sheets (https://sheets.new) and title it "SalaryPathGuide Submissions".
 * 2. In Row 1, add these exact column headers:
 *    A: Timestamp
 *    B: Company
 *    C: Role
 *    D: Level Code
 *    E: Metro Location
 *    F: Base Salary ($)
 *    G: Annual Bonus (%)
 *    H: 4-Year Equity ($)
 *    I: Sign-on Bonus ($)
 *    J: Year 1 Total Comp ($)
 *    K: Negotiation Notes / Tips
 * 
 * 3. In Google Sheets menu, click: Extensions -> Apps Script
 * 4. Paste this entire file into the Apps Script editor (replacing any code there).
 * 5. Click the blue "Deploy" button at the top right -> "New deployment".
 * 6. Click the gear icon next to "Select type" -> choose "Web app".
 * 7. Fill in:
 *    - Description: SalaryPathGuide Compensation Collector
 *    - Execute as: Me (your Google account)
 *    - Who has access: Anyone (CRITICAL: allows anonymous visitors to submit)
 * 8. Click "Deploy", review/grant permissions, and copy the generated "Web App URL"
 *    (looks like: https://script.google.com/macros/s/AKfycb.../exec).
 * 9. Provide that URL or set it in app.js as GOOGLE_SHEET_WEBHOOK_URL.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};
    
    // Parse incoming JSON or form parameters
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // Append submission row
    var row = [
      data.timestamp || new Date(),
      data.company || "Anonymous",
      data.role || "Software Engineer",
      data.level || "L4",
      data.location || "US",
      Number(data.baseSalary) || 0,
      Number(data.bonusPct) || 0,
      Number(data.equity) || 0,
      Number(data.signon) || 0,
      Number(data.totalCompYear1) || 0,
      data.notes || ""
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", received: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "active", service: "SalaryPathGuide Webhook" }))
    .setMimeType(ContentService.MimeType.JSON);
}
