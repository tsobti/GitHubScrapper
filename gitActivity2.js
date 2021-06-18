//to find the top 5 projects inside the topic
const request = require("request");
const cheerio = require("cheerio");

request("https://github.com/topics",callback);

function callback(error, response, html) {
  if (!error) {
    const manipulationTool = cheerio.load(html);

    //pass the selector of the anchor tag in manipulationTool
    //selector of anchor passes bcoz we want to use attr tag to find the attribute href to get link //***
    let allLinks=manipulationTool(".no-underline.d-flex.flex-column");
   
    console.log(allLinks.length);

    for(let i=0;i<allLinks.length;i++)
    {
        let projectName=manipulationTool(manipulationTool(allLinks[i]).find("p")[0]).text().trim(); //.find(css selector)[index]
        //the topic is in first p tag, so,  1.MT to find 1st p   2.MT to convert to text and trim 
        let url= "https://github.com/"+manipulationTool(allLinks[i]).attr("href");    //*** 
        
        topicProcessor(url,projectName);
    }
  }
}


function topicProcessor(url,projectName)
{
    request(url, function(err,res,html)
    {
        const manipulationTool=cheerio.load(html);

        let allHeadings=manipulationTool(".f3.color-text-secondary.text-normal.lh-condensed");
        allHeadings=allHeadings.slice(0,5);

        for(let i=0;i<allHeadings.length;i++)
        {
            console.log(manipulationTool(manipulationTool(allHeadings[i]).find("a")[1]).text().trim());
            console.log("https://github.com/"+manipulationTool(manipulationTool(allHeadings[i]).find("a")[1]).attr("href"));
        }
    });
}