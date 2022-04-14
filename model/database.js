'use strict';
/*******************************************************************************
 * The MIT License
 * Copyright 2022, Wolfgang Kaisers
 * Permission is hereby granted, free of charge, to any person obtaining a 
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included 
 * in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 ******************************************************************************/

const { Sequelize, Model, DataTypes } = require('sequelize');
const path = require('path');

const General = require(path.join(__dirname, '..', 'config', 'general'));


/// //////////////////////////////////////////////////////////////////////// ///
/// Thalas database
/// * Database tables will be created via sequelize.sync in initDatabase.js
/// //////////////////////////////////////////////////////////////////////// ///

/// ------------------------------------------------------------------------ ///
/// Authorisation
/// ------------------------------------------------------------------------ ///

const sequelize = new Sequelize(
  General.database.name,
  General.database.user,
  General.database.password, 
  { 
    dialect: 'mysql',
    logging: false
  }
)

/// ------------------------------------------------------------------------ ///
/// Devices and connections
/// ------------------------------------------------------------------------ ///


/// Device object creates unique id from ip

class Device extends Model {}
Device.init({
  id:{
    type:          DataTypes.BIGINT,
    primaryKey:    true,
    autoIncrement: false
  },
  name:     DataTypes.STRING,
  ip:       DataTypes.STRING,
  hostname: DataTypes.STRING,
  mac:      DataTypes.STRING
}, {
  sequelize,
  modelName: 'device',
  freezeTableName: true
});


class XenonOsStatus extends Model {}
XenonOsStatus.init({
  ip:         DataTypes.STRING,
  deviceid:   DataTypes.BIGINT,
  deviceName: DataTypes.STRING,
  port:       DataTypes.INTEGER,
  interface:  DataTypes.STRING,
  online:     DataTypes.BOOLEAN,
  hostname:   DataTypes.STRING,
  freemem:    DataTypes.BIGINT,
  totalmem:   DataTypes.BIGINT,
  uptime:     DataTypes.DOUBLE,
  errno:      DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'xnOsStatus',
  freezeTableName: true
});



class XenonPortStatus extends Model {}
XenonPortStatus.init({
  ip:         DataTypes.STRING,
  deviceid:   DataTypes.BIGINT,
  deviceName: DataTypes.STRING,
  port:       DataTypes.INTEGER,
  open:       DataTypes.BOOLEAN,
  openText:   DataTypes.STRING,
  path:       DataTypes.STRING,
  baudRate:   DataTypes.INTEGER,
  dataBits:   DataTypes.INTEGER,
  parity:     DataTypes.STRING,
  stopBits:   DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'xnPortStatus',
  freezeTableName: true
});



class DeviceConnection extends Model {}
DeviceConnection.init({
  ip:    DataTypes.STRING,
  begin: DataTypes.DATE,
  end:   DataTypes.DATE
}, {
  sequelize,
  modelName: 'deviceConnection',
  freezeTableName: true
});

/// ------------------------------------------------------------------------ ///
/// Recording episodes
/// ------------------------------------------------------------------------ ///

class Episode extends Model {}
Episode.init({
  device: DataTypes.BIGINT,   /// Device id (from ip)
  value:  DataTypes.STRING,
  begin:  DataTypes.DATE,     /// ISO format
  end:    DataTypes.DATE
}, {
  sequelize,
  modelName: 'episode',
  freezeTableName: true
});


/// ------------------------------------------------------------------------ ///
/// Subset of Medibus data: See xenon: model/data/ventilation.js
/// ------------------------------------------------------------------------ ///

class MedibusVentRespData extends Model {}
MedibusVentRespData.init({
    msgId:        DataTypes.INTEGER,
    device:       DataTypes.BIGINT,
    episode:      DataTypes.STRING,
    time:         DataTypes.DATE,
    compliance:   DataTypes.INTEGER,
    peak:         DataTypes.INTEGER,
    plateau:      DataTypes.INTEGER,
    peep:         DataTypes.INTEGER,
    rate:         DataTypes.INTEGER,
    tidalvolume:  DataTypes.INTEGER,
    minutevolume: DataTypes.FLOAT
  }, {
    sequelize,
    indexes: [ { fields: [ 'episode' ] } ], 
    modelName: 'mbVentResp',
    freezeTableName: true
});


class MedibusVentGasData extends Model {}
MedibusVentGasData.init({
    msgId:        DataTypes.INTEGER,
    device:       DataTypes.BIGINT,
    episode:      DataTypes.STRING,
    time:         DataTypes.DATE,
    fio2:     DataTypes.INTEGER,
    feo2:     DataTypes.INTEGER,
    o2uptake: DataTypes.INTEGER,
    fico2:    DataTypes.INTEGER,
    feco2:    DataTypes.INTEGER
  }, {
  sequelize,
  indexes: [ { fields: [ 'episode' ] } ], 
  modelName: 'mbVentGas',
  freezeTableName: true
});


class MedibusVentInhalData extends Model {}
MedibusVentInhalData.init({
  msgId:    DataTypes.INTEGER,
  device:   DataTypes.BIGINT,
  episode:  DataTypes.STRING,
  time:     DataTypes.DATE,
  mac:      DataTypes.FLOAT,
  inhal:    DataTypes.INTEGER,  /// Encoded gas type: General.inhalation (array)
  gas  :    DataTypes.STRING,
  insp:     DataTypes.FLOAT,
  exsp:     DataTypes.FLOAT,
  cons:     DataTypes.FLOAT
  }, {
  sequelize,
  indexes: [ { fields: [ 'episode' ] } ], 
  modelName: 'mbVentInhal',
  freezeTableName: true
});




/// ------------------------------------------------------------------------ ///
/// Parameter defined in Medibus Protocol
/// ------------------------------------------------------------------------ ///

class MedibusParameter extends Model {
  async dumpToJson(filename) {
    return this.findAll()
      .then(res => res.map(p => p.dataValues) )
      .then(res => JSON.stringify([... res.values()], null, 2))
      .then(res => fs.promises.writeFile(General.content.params.filename, res))
  }
}
MedibusParameter.init({
  id: {
    type:           DataTypes.INTEGER,
    primaryKey:     true,
    autoIncrement:  true
  },
  code:         DataTypes.STRING,
  hexCode:      DataTypes.INTEGER,
  description:  DataTypes.STRING,
  unit:         DataTypes.STRING,
  snomedid:     DataTypes.INTEGER,
  format:       DataTypes.STRING,
  factor: {
    type:       DataTypes.INTEGER,
    defaultValue: 1
  },
  m:  DataTypes.STRING,
  ll: DataTypes.BOOLEAN,
  hl: DataTypes.BOOLEAN
}, {
  sequelize,
  modelName: 'medibusParameter',
  freezeTableName: true
});

class MbDbInput {
  
  /// ////////////////////////////////////////////////////////////////////// ///
  /// Reformat medibus data objects
  /// ////////////////////////////////////////////////////////////////////// ///
  static reformatVentData(data) {
    return {
      msgId:   data.msgId,
      time:    data.time,
      episode: data.episode,
      respiration: {
        peak:         data.respiration.peak.value,
        plateau:      data.respiration.plateau.value,
        peep:         data.respiration.peep.value,
        rate:         data.respiration.rate.value,
        tidalvolume:  data.respiration.tidalvolume.value,
        minutevolume: data.respiration.minutevolume.value,
        compliance:   data.patient.compliance
      },
      gas: {
        fio2:     data.gas.fio2.value,
        feo2:     data.gas.feo2.value,
        o2uptake: data.gas.o2uptake.value,
        feco2:    data.gas.feco2.value,
        fico2:    data.gas.fico2.value
      },
      inhalation: {
        mac: data.inhalation.mac,
        sevoflurane: {
          insp: data.inhalation.sevoflurane.insp.value,
          exp:  data.inhalation.sevoflurane.exp.value,
          cons: data.inhalation.sevoflurane.cons
        },
        desflurane: {
          insp: data.inhalation.desflurane.insp.value,
          exp:  data.inhalation.desflurane.exp.value,
          cons: data.inhalation.desflurane.cons
        },
        isoflurane: {
          insp: data.inhalation.isoflurane.insp.value,
          exp:  data.inhalation.isoflurane.exp.value,
          cons: data.inhalation.isoflurane.cons
        }
      }
    }
  } 

  static reformatInhalData(inhal) {
    if(inhal.sevoflurane.insp != null){
      return {
        i    : 0,
        gas  : General.inhalation[0].db,
        insp : inhal.sevoflurane.insp,
        exsp : inhal.sevoflurane.exp,
        cons : inhal.sevoflurane.cons
        }
    } else if(inhal.desflurane.insp != null){
      return {
        i    : 1,
        gas  : General.inhalation[1].db,
        insp : inhal.desflurane.insp,
        exsp : inhal.desflurane.exp,
        cons : inhal.desflurane.cons
        }
    } else if(inhal.isoflurane.insp != null) {
      return {
        i    : 2,
        gas  : General.inhalation[2].db,
        insp : inhal.isoflurane.insp,
        exsp : inhal.isoflurane.exp,
        cons : inhal.isoflurane.cons
        }
    } else {
      return {
        i    : -1,
        gas  : null,
        insp : null,
        exsp : null,
        cons : null
      }
    }
  }

  static async saveMedibusVentRespData(data, devid) {
    return MedibusVentRespData.build({
      msgId:        data.msgId,
      device:       devid,
      episode:      data.episode,
      time:         data.time,
      compliance:   data.patient.compliance,
      peak:         data.respiration.peak,
      plateau:      data.respiration.plateau,
      peep:         data.respiration.peep,
      rate:         data.respiration.rate,
      tidalvolume:  data.respiration.tidalvolume,
      minutevolume: data.respiration.minutevolume
    }).save();

  }

  static async saveMedibusVentGasData(data, devid) {
    return MedibusVentGasData.build({
        msgId:    data.msgId,
        device:   devid,
        episode:  data.episode,
        time:     data.time,
        fio2:     data.gas.fio2,
        feo2:     data.gas.feo2,
        o2uptake: data.gas.o2uptake,
        fico2:    data.gas.fico2,
        feco2:    data.gas.feco2
      }).save();
  }
  
  static async saveMedibusVentInhalData(data, devid) {
    let inhal = MbDbInput.reformatInhalData(data.inhalation);
    return MedibusVentInhalData.build({
      msgId:    data.msgId,
      device:   devid,
      episode:  data.episode,
      time:     data.time,
      mac:      data.inhalation.mac,
      inhal:    inhal.i,  /// Encoded gas type: General.inhalation (array)
      gas  :    inhal.gas,
      insp:     inhal.insp,
      exsp:     inhal.exsp,
      cons:     inhal.cons
    }).save();
  }
  
}


module.exports = {
  sequelize,
  Device,
  XenonOsStatus,
  XenonPortStatus,
  DeviceConnection,
  Episode,
  MedibusVentRespData,
  MedibusVentGasData,
  MedibusVentInhalData,
  MbDbInput,
  MedibusParameter
}
