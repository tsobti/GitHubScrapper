//name, issues as well in a particular topic, stored in data4 JSON File.

//storing inside json file
const request = require("request");
const cheerio = require("cheerio");
let fs=require("fs");
let data={};

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


function topicProcessor(url,topicName)
{
    request(url, function(err,res,html)
    {
        let manipulationTool=cheerio.load(html);

        let allHeadings=manipulationTool(".f3.color-text-secondary.text-normal.lh-condensed");
        allHeadings=allHeadings.slice(0,5);

        for(let i=0;i<allHeadings.length;i++)
        {
            //saving project name and topic name in a JSON file
            if(!data[topicName])
            {
                data[topicName]=[];
                data[topicName].push({name: manipulationTool(manipulationTool(allHeadings[i]).find("a")[1]).text().trim(),});
            }

            else
            {   
                data[topicName].push({name: manipulationTool(manipulationTool(allHeadings[i]).find("a")[1]).text().trim(),});
        
            }


            projectName= manipulationTool(manipulationTool(allHeadings[i]).find("a")[1]).text().trim();
            projectUrl="https://github.com/"+manipulationTool(manipulationTool(allHeadings[i]).find("a")[1]).attr("href");

            projectProcessor(projectUrl, topicName, projectName);
        }

        //fs.writeFileSync("data.json",JSON.stringify(data));
    });
}


//WORKED HERE
function projectProcessor(projectUrl,topicName,projectName)
{
    projectUrl=projectUrl+"/issues";

    request(projectUrl, function(err,res,html)
    {
        let mt=cheerio.load(html);

        let allAnchors=mt(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title");


        let index=-1;
        for(let j=0;j<data[topicName].length;j++)
        {
            if(data[topicName][j].name==projectName)
            {
                index=j;
                break;
            }
        }

        allAnchors=allAnchors.slice(0,5);
        for(let i=0;i<allAnchors.length;i++)
        {
            let link="https://github.com/"+mt(allAnchors[i]).attr("href");
            let name=mt(allAnchors[i]).text();


            if(!data[topicName][index].issues)
            {
                data[topicName][index].issues=[];
                data[topicName][index].issues.push({name,link});
            }

            else
            {
                data[topicName][index].issues.push({name,link});
            }
        }
    fs.writeFileSync("data4.json",JSON.stringify(data));

    });

}