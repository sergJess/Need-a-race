export interface CarsParametrs{
  name: string;
  color: string;
  id: number,
  status? : string
}
export interface EnginesParametrs{
  velocity: number;
  distance: number
}
export interface updateCarParametrs{
  name: string;
  color: string;
}
export async function deleteCar(url: string):Promise<Response> {
  const response = await fetch(url, { method: 'DELETE' });
  return response;
}
export async function getCars(url: string):Promise<CarsParametrs[]> {
  const response = await fetch(url);
  return response.json();
}
export async function createCar(url:string, data:updateCarParametrs): Promise<CarsParametrs> {
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  return response.json();
}
export async function Engine(url:string, id:string, status:string): Promise<Response> {
  const urlLink = new URL(url);
  urlLink.searchParams.append('id', `${id}`);
  urlLink.searchParams.append('status', `${status}`);
  const response = await fetch(`${urlLink}`, { method: 'PATCH' });
  return response;
}
