interface LogbookProps {
  id?: string;
  name: string;
  description?: string;
  // this would be an object of timestamp to singular heat map details
  heatMap: any; // or plain logs .... or pass in plain logs & goals and get heatMap
  visibility: any; // enum(public, private)
  category: any;
}

interface CreateLogbookProps {
  id?: string;
  name: string;
  description?: string;
  visibility: any;
  category: any;
  goals?: any[];
  logs?: any[];
}
