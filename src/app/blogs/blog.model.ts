export class Blog {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public author: string,
    public content: string,
    public userId: string,
    public lastModified: Date
  ) {}
}
