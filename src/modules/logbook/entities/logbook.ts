interface BaseLogbookProps {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  visibility: any; // enum(public, private)
  category: any;
}

interface LogbookProps extends BaseLogbookProps {
  // this would be an object of timestamp to singular heat map details
  heatMap: any; // or plain logs .... or pass in plain logs & goals and get heatMap
}

interface CreateLogbookProps extends BaseLogbookProps {
  goals?: any[];
  logs?: any[];
}

// idea
// have a getLiteLogbook repo method!!!!
