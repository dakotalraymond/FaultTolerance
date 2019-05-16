export class FileChunkModel {
  constructor(
    public name: string,
    public position: number,
    public data: Buffer
    ) { }
}
