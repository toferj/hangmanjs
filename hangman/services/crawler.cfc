component{
    
    remote string function getRandomWord(category) returnformat="JSON"{
        local.url = 'https://www.thegamegal.com/wordgenerator/generator.php?game=1&category=#arguments.category#';

        local.httpSvc = new http();
        local.httpSvc.setMethod('GET');
        local.httpSvc.setURL(local.url);

        local.result = local.httpSvc.send().getPrefix();
        return local.result.filecontent;
    };
}
