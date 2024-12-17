export class DateUtils {
  static MostRecently(days: number, values_filter: any): boolean {
      const date = new Date();
      const diferentLates = date.getTime() - new Date(values_filter).getTime();
      const diffInMinutes = Math.floor(diferentLates / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays <= days;
  }
}
