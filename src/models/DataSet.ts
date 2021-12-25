import { immerable, isDraft, original } from 'immer';
import * as dataSchemas from '../schemas/data';
import * as dataSetSchemas from '../schemas/dataSet';
import Data, { IData } from './Data';
import Label, { ILabel, ILabelDatum } from './Label';

export interface IDataSet {
  data: Data;
}

class DataSet implements IDataSet {
  [immerable] = true;
  data!: Data;

  constructor (dataSet?: IDataSet) {
    this.data = new Data(dataSet?.data);
  }

  static factory (): IDataSet {
    return { data: new Data() };
  }

  /**
   * turn stale data into latest data structure
   * @param object {any}
   * @returns {IDataSet}
   */
  private static massage (object: IData | ILabelDatum[]): IDataSet {
    if (Array.isArray(object)) {
      return object.reduce<IDataSet>((dataSet, datum) => {
        const { data } = dataSet;
        const { user, labels } = datum;
        data[user] = labels.map((label) => {
          if (typeof label === 'string') {
            // backward compatible
            const text = label;
            return new Label(text);
          }
          const { text, reason, url, date, source, image } = label;
          return new Label(text, reason, url, date, source, image);
        });
        return dataSet;
      }, this.factory());
    }
    return { data: new Data(object) };
  }

  /**
   * validate the given object as custom labels data, massage the object when necessary
   * @param object {any} the object to be validated
   * @returns {IDataSet | null}
   */
  static validate (object: any): IDataSet | null {
    const _schemas = [dataSetSchemas.default, dataSchemas.default];
    for (const schema of _schemas) {
      const { value, error } = schema.validate(object);
      if (!error) {
        if (schema === dataSetSchemas.default) {
          return value;
        }
        if (schema === dataSchemas.default) {
          return this.massage(value);
        }
      }
    }
    return null;
  }

  static implements (object: any): object is IDataSet {
    return (
      object instanceof this
      || (
        'data' in object
      )
    );
  }

  /**
   * prepare for storage
   * @abstract
   */
  serialize (): void { };

  aggregate () {
    const { data } = this;
    const users = Object.keys(data);
    const labels = users.reduce<Label[]>((labels, user) => {
      const _labels = data[user] || [];
      labels = labels.concat(_labels);
      return labels;
    }, []);
    return { users, labels };
  }

  add (user: string, data: Pick<ILabel, 'text' | 'reason' | 'source' | 'color' | 'image'>) {
    this.data[user] = this.data[user] || [];
    const labels = this.data[user]!;
    const { text, reason, source, color, image } = data;
    const { href: url } = window.location;
    const date = Date.now();
    const label = new Label(text, reason, url, date, source, color, image);
    labels.push(label);
    return this;
  }

  edit (user: string, label: Label, data: Pick<ILabel, 'text' | 'reason' | 'color' | 'image'>) {
    const _this = isDraft(this) ? original(this)! : this; // always use the original `this` for reference checking 
    const labels = _this.data[user] || [];
    const index = labels.indexOf(label);
    if (index >= 0) {
      const labels = this.data[user] || [];
      const target = labels[index];
      const { text, reason = '', color = '', image = '' } = data;
      target.text = text;
      target.reason = reason;
      target.color = color;
      target.image = image;
    }
    return this;
  }

  remove (user: string, label: Label) {
    const _this = isDraft(this) ? original(this)! : this; // always use the original `this` for reference checking 
    const labels = _this.data[user] || [];
    const index = labels.indexOf(label);
    if (index >= 0) {
      const labels = this.data[user] || [];
      labels.splice(index, 1);
      if (labels.length === 0) {
        delete this.data[user];
      }
    }
    return this;
  }
}

export default DataSet;
