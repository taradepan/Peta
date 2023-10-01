const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();


const OPENAIHEADERS = {
    'content-type': 'application/json',
    'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY
};

async function createEmbedding(textToEmbed) {
    try {
        const response = await axios.post('https://api.openai.com/v1/embeddings', {
            'model': 'text-embedding-ada-002',
            'input': [textToEmbed]
        }, {
            headers: OPENAIHEADERS
        });

        if (response.status === 200) {
            const data = response.data;
            if (data && data.data && data.data[0] && data.data[0].embedding) {
                const embeddings = data.data[0].embedding;
                // console.log(textToEmbed)
                // console.log('Embeddings:', embeddings);
                return embeddings;
            } else {
                console.error('Embeddings not found in API response.');
                return null;
            }
        } else {
            console.error('Error:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

const textToEmbed = "Title ExploringVectorDatabases UnleashingthePowerofHigh DimensionalData Intherealmofdatamanagementandretrieval vectordatabaseshaveemergedasa revolutionarysolutionforhandlinghigh dimensionaldataefficiently Thesedatabasesoffera paradigmshiftinhowwestore search andanalyzeinformation makingthemparticularly valuableinfieldssuchasmachinelearning naturallanguageprocessing recommendation systems andmore Inthisarticle we lldelveintotheworldofvectordatabases exploringwhat theyare whytheyareessential andhowtheywork WhatisaVectorDatabase Avectordatabase alsoknownasavectorstorageorvectorindexdatabase isaspecialized databasemanagementsystemdesignedtostoreandqueryhigh dimensionalvectorsefficiently Vectors inthiscontext representmulti dimensionaldatapointsoftenusedtoencodefeatures orcharacteristicsofobjects documents orentities Thesedatabasesexcelinscenarioswhere traditionalrelationaldatabasesfallshortduetotheirinabilitytohandletheinherentcomplexity ofhigh dimensionaldata KeyFeaturesandBenefits EfficientSimilaritySearch Oneoftheprimaryusecasesforvectordatabasesissimilarity search Theyallowyoutofinditemssimilartoagivenqueryvector makingtheminvaluablein recommendationsystems content basedsearch andanomalydetection Scalability Vectordatabasesarebuilttoscalehorizontally makingthemsuitableforhandling vastdatasets Asyourdatagrows youcaneasilyaddmorenodestotheclustertomaintain performance LowLatency Thesedatabasesareoptimizedforlow latencyqueries ensuringthatyoucan retrieveresultsinreal timeornear real time acriticalrequirementforapplicationslike personalizationengines SupportforHighDimensions Unliketraditionaldatabases whichmaystrugglewith high dimensionaldata vectordatabasesaredesignedtohandledatawithhundredsoreven thousandsofdimensionseffectively Versatility Vectordatabasesareversatileandcanbeusedinvariousdomains including imagerecognition textanalysis genetics andmore HowVectorDatabasesWork Vectordatabasestypicallyemployadvanceddatastructuresandalgorithmstofacilitateefficient searchoperations Theyusetechniqueslikemetricspaceindexing locality sensitivehashing LSH andtreestructurestoorganizeandindexvectorsforquickretrieval Whenaqueryvector issubmitted thedatabasequicklyidentifiestheclosestvectorsbasedonsimilaritymetrics providingfastandaccurateresults UseCases RecommendationEngines Vectordatabasespowerrecommendationsystemsbyfindingitems similartowhatauserhasinteractedwithinthepast Thisiswidelyusedine commerce platforms contentstreamingservices andsocialnetworks SemanticSearch Theyenablesemanticsearchenginestoretrievedocumentsoritemsthat aresemanticallysimilartoagivenquery improvingsearchaccuracy AnomalyDetection Incybersecurityandfrauddetection vectordatabasesareusedtoidentify unusualpatternsoroutliersinhigh dimensionaldata NaturalLanguageProcessing Vectorrepresentationsofwordsandsentencesarestoredand queriedtoenablesemanticunderstandingandsentimentanalysisinNLPapplications Challenges ScalabilityMaintenance Asdatabasesscaletohandlemassivedatasets maintaining performanceandqueryspeedbecomesachallenge DataDimensionality High dimensionaldatacanleadtothecurseofdimensionality wherethe effectivenessofcertainalgorithmsdecreasesasthedimensionalityofthedataincreases DataIngestion Efficientlyingestingandencodingdataashigh dimensionalvectorscanbea complexprocess Conclusion Vectordatabaseshaveredefinedhowwemanageandretrieveinformation especiallyin scenariosinvolvinghigh dimensionaldata Withtheirabilitytoperformsimilaritysearchesat scale theyhavebecomethebackboneofmodernrecommendationsystems searchengines andmore Astechnologycontinuestoadvance vectordatabaseswilllikelyplayanincreasingly criticalroleinextractinginsightsfromcomplexdatasetsandpoweringinnovativeapplications acrossvariousdomains Inanagewheredataisking vectordatabasesofferapathtounlockingthehiddenvaluewithin high dimensionalinformation propellingusintoafuturewheredata drivendecisionsaremore informedandimpactfulthaneverbefore";
createEmbedding(textToEmbed);

module.exports = {createEmbedding};