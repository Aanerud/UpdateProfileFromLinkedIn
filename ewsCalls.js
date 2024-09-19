/* global Office */

// Function to make an EWS request and log the result
function makeEwsRequest(ewsRequest, callback) {
    const mailbox = Office.context.mailbox;
    mailbox.makeEwsRequestAsync(ewsRequest, (asyncResult) => {
        if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
            console.log("EWS request succeeded.");
            callback(null, asyncResult.value);
        } else {
            console.error(`EWS request failed. Error: ${asyncResult.error.message}`);
            callback(asyncResult.error.message, null);
        }
    });
}

// Function to fetch the RawJSON property from a specific folder in the mailbox
function fetchRawJson() {
    const mailbox = Office.context.mailbox;
    const itemId = mailbox.item.itemId;

    const ewsRequest = `
        <?xml version="1.0" encoding="utf-8"?> 
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                    xmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages" 
                    xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types" 
                    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> 
        <soap:Header>
            <t:RequestServerVersion Version="Exchange2013" />
        </soap:Header>
        <soap:Body> 
            <m:GetItem> 
            <m:ItemShape> 
                <t:BaseShape>IdOnly</t:BaseShape> 
                <t:AdditionalProperties>
                    <t:ExtendedFieldURI PropertyTag="0x8173000A" PropertyType="String" />
                </t:AdditionalProperties>
            </m:ItemShape> 
            <m:ItemIds> 
                <t:ItemId Id="${itemId}" /> 
            </m:ItemIds> 
            </m:GetItem> 
        </soap:Body> 
        </soap:Envelope>`;

    makeEwsRequest(ewsRequest, (error, response) => {
        if (error) {
            console.error('Error fetching RawJSON:', error);
            document.getElementById("rawJson").textContent = "Error fetching RawJSON.";
        } else {
            const rawJson = extractValue(response, 'RawJSON');
            document.getElementById("rawJson").textContent = rawJson;
        }
    });
}

// Utility function to extract a specific value from the EWS response
function extractValue(response, propertyName) {
    const regex = new RegExp(`<t:ExtendedFieldURI[^>]+PropertyName="${propertyName}"[^>]*><t:Value>(.*?)</t:Value>`, 'i');
    const match = response.match(regex);
    return match ? match[1] : "Not found";
}

module.exports = { fetchRawJson };
