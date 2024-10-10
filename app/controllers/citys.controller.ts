import { Response, Request } from "express";
import { formatJsonApiError } from "../serializers/error.serializer";
import CityService from "../services/citys.service";

const cityController = {
    addNewCity : async (req: Request, res: Response) : Promise<any> =>  {
        try {
            const { postal, name, x, y } = req.body;
            const cityService = new CityService();
            const city = await cityService.addNewCity(postal,name,x,y);
            return res.status(200).send(city);
        } catch (error) {
            const formattedError = formatJsonApiError([
                {
                    status: '500',
                    title: 'Internal Server Error',
                    detail: error,
                },
            ]);
            res.set('Content-Type', 'application/vnd.api+json');
            return res.status(500).json(formattedError);
        }
    }
};

export default cityController;
